use std::process::Command;
use std::os::windows::process::CommandExt;
use tauri::{Manager, Emitter};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
use std::fs;
use crate::activity;
use crate::assignment;

// Windows constants
const CREATE_NEW_CONSOLE: u32 = 0x00000010;
const CREATE_NO_WINDOW: u32 = 0x08000000;

//Private Helper: helper to get exe_dir
fn get_exe_dir() -> Result<std::path::PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;

    let dir = exe.parent()
        .ok_or("Failed to get parent directory of exe")?;

    Ok(dir.to_path_buf())
}

//private helper: get path to drives
fn get_drives_dir()-> Result<PathBuf, String> {
    let dir = get_exe_dir()?;
    Ok(dir.join("drives"))
}

//private helper: get win64 resource for qemu
fn get_win64_dir(app: tauri::AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?;

    let win64 = resource_dir.join("resources").join("win64");

    if !win64.exists() {
        return Err(format!("Win64 folder not found: {:?}", win64));
    }

    Ok(win64)
}

// Helper function to check if QEMU is running
fn is_qemu_process_running() -> bool {
    let output = Command::new("tasklist")
        .args(["/FI", "IMAGENAME eq qemu-system-x86_64.exe", "/NH"])
        .creation_flags(CREATE_NO_WINDOW)
        .output();

    if let Ok(output) = output {
        let stdout = String::from_utf8_lossy(&output.stdout);
        return stdout.contains("qemu-system-x86_64.exe");
    }
    false
}

#[tauri::command]
// In React use: invoke("launch_qemu")
pub fn launch_qemu(app_handle: tauri::AppHandle) -> Result<(), String> {
    let current_assignment = assignment::get_assignment()?;
    activity::add_activity(format!("Attempting to launch Assignment {}", current_assignment)).ok();

    // --- Resolve paths ---
    let win64_dir = get_win64_dir(app_handle.clone())?;
    let drives_dir = get_drives_dir()?;

    let qemu_exe = win64_dir.join("qemu-system-x86_64.exe");
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
    let overlay_path = drives_dir.join("overlay").join(&overlay_name);

    // --- Verify files exist ---
    if !qemu_exe.exists() {
        return Err(format!("QEMU executable not found: {:?}", qemu_exe));
    }

    if !overlay_path.exists() {
        return Err(format!("Overlay disk not found: {:?}", overlay_path));
    }

    // --- Convert paths to strings, handling the \\?\ prefix ---
    let qemu_exe_str = qemu_exe
        .to_str()
        .ok_or("Invalid QEMU path")?
        .trim_start_matches(r"\\?\");
    
    let overlay_path_str = overlay_path
        .to_str()
        .ok_or("Invalid overlay path")?
        .trim_start_matches(r"\\?\");

    // --- Create a temporary batch file ---
    let temp_dir = std::env::temp_dir();
    let batch_file = temp_dir.join(format!("launch_qemu_{}.bat", current_assignment));

    let batch_content = format!(
        "@echo off\r\n\
        title QEMU Assignment {}\r\n\
        echo Starting QEMU...\r\n\
        echo.\r\n\
        \"{}\" -m 1G -smp 2 -nographic -device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22 -drive if=virtio,format=qcow2,file=\"{}\" -monitor telnet::45454,server,nowait -serial mon:stdio\r\n\
        echo.\r\n\
        echo QEMU has exited.\r\n\
        echo Press any key to close this window...\r\n\
        pause > nul\r\n\
        del \"%~f0\"\r\n",
        current_assignment,
        qemu_exe_str,
        overlay_path_str
    );

    fs::write(&batch_file, batch_content)
        .map_err(|e| format!("Failed to create batch file: {}", e))?;

    let batch_file_str = batch_file.to_str().ok_or("Invalid batch file path")?;

    // Log the command
    activity::add_activity(format!("Launching QEMU with overlay: {}", overlay_name)).ok();

    // --- Launch the batch file in a new console window ---
    Command::new(batch_file_str)
        .creation_flags(CREATE_NEW_CONSOLE)
        .spawn()
        .map_err(|e| format!("Failed to launch QEMU: {}", e))?;

    // Emit event that QEMU is starting
    app_handle.emit("qemu-status", "started").ok();

    // Spawn a thread to poll for QEMU process
    let app_clone = app_handle.clone();
    thread::spawn(move || {
        // Give QEMU a moment to start
        thread::sleep(Duration::from_millis(2000));
        
        // Wait for QEMU to actually start
        let mut started = false;
        for _ in 0..20 {  // Try for up to 10 seconds
            if is_qemu_process_running() {
                started = true;
                break;
            }
            thread::sleep(Duration::from_millis(500));
        }

        if !started {
            activity::add_activity("QEMU process never started".to_string()).ok();
            app_clone.emit("qemu-status", "error").ok();
            return;
        }

        activity::add_activity("QEMU process detected, monitoring...".to_string()).ok();

        // Poll every second to check if QEMU is still running
        loop {
            thread::sleep(Duration::from_secs(1));
            
            if !is_qemu_process_running() {
                activity::add_activity("QEMU process has terminated".to_string()).ok();
                app_clone.emit("qemu-status", "stopped").ok();
                break;
            }
        }
    });

    Ok(())
}