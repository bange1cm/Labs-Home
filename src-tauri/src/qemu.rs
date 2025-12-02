use std::process::Command;
use std::os::windows::process::CommandExt;
use tauri::{Manager, Emitter};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
use std::fs;
use crate::activity;
use crate::assignment;

const CREATE_NEW_CONSOLE: u32 = 0x00000010;
const CREATE_NO_WINDOW: u32 = 0x08000000;

//Private helper
fn get_exe_dir() -> Result<PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;
    
    exe.parent()
        .ok_or("Failed to get parent directory of exe".to_string())
        .map(|p| p.to_path_buf())
}

//public helper (can access in other rust files)
pub fn get_drives_dir() -> Result<PathBuf, String> {
    Ok(get_exe_dir()?.join("drives"))
}
//helper. resources/win64
pub fn get_win64_dir(app: tauri::AppHandle) -> Result<PathBuf, String> {
    let win64 = app
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?
        .join("resources")
        .join("win64");

    if !win64.exists() {
        return Err(format!("Win64 folder not found: {:?}", win64));
    }

    Ok(win64)
}

//Private helper
fn is_qemu_process_running() -> bool {
    Command::new("tasklist")
        .args(["/FI", "IMAGENAME eq qemu-system-x86_64.exe", "/NH"])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .ok()
        .map(|output| String::from_utf8_lossy(&output.stdout).contains("qemu-system-x86_64.exe"))
        .unwrap_or(false)
}

//Use: invoke(launch_qemu)
#[tauri::command]
pub fn launch_qemu(app_handle: tauri::AppHandle) -> Result<(), String> {
    let current_assignment = assignment::get_assignment()?;
    activity::add_activity(format!("Attempting to launch Assignment {}", current_assignment)).ok();

    let global_id = crate::initialize::get_global_id()?;

    let win64_dir = get_win64_dir(app_handle.clone())?;
    let drives_dir = get_drives_dir()?;

    //qemu exe inside resources/win64
    let qemu_exe = win64_dir.join("qemu-system-x86_64.exe");
    if !qemu_exe.exists() {
        return Err(format!("QEMU executable not found: {:?}", qemu_exe));
    }
    let qemu_exe_str = qemu_exe
        .to_str()
        .ok_or("Invalid QEMU path")?
        .trim_start_matches(r"\\?\");

    //overlay file inside drives/overlay
    let overlay_path = drives_dir
        .join("overlay")
        .join(format!("{}_a{}.qcow2", global_id, current_assignment));
    if !overlay_path.exists() {
        return Err(format!("Overlay disk not found: {:?}", overlay_path));
    }
    let overlay_path_str = overlay_path
        .to_str()
        .ok_or("Invalid overlay path")?
        .trim_start_matches(r"\\?\");

    //use batch file to launch new terminal
    let batch_file = std::env::temp_dir().join(format!("launch_qemu_{}.bat", current_assignment));
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

    Command::new(batch_file.to_str().ok_or("Invalid batch file path")?)
        .creation_flags(CREATE_NEW_CONSOLE)
        .spawn()
        .map_err(|e| format!("Failed to launch QEMU: {}", e))?;

    app_handle.emit("qemu-status", "started").ok();

    //thread to keep track if qemu terminal is still open
    thread::spawn(move || {
        thread::sleep(Duration::from_millis(2000));
        
        let mut started = false;
        for _ in 0..20 {
            if is_qemu_process_running() {
                started = true;
                break;
            }
            thread::sleep(Duration::from_millis(500));
        }

        if !started {
            activity::add_activity("QEMU process never started".to_string()).ok();
            app_handle.emit("qemu-status", "error").ok();
            return;
        }

        loop {
            thread::sleep(Duration::from_secs(1));
            
            if !is_qemu_process_running() {
                app_handle.emit("qemu-status", "stopped").ok();
                break;
            }
        }
    });

    Ok(())
}