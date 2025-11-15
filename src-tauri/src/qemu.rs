use std::process::Command;
use tauri::{Manager, Emitter};
use std::path::PathBuf;
use std::thread;
use crate::activity;
use crate::assignment;

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

    // --- Build drive argument (needs to live long enough) ---
    let drive_arg = format!("if=virtio,format=qcow2,file={}", overlay_path.display());

    // --- Build QEMU arguments as a Vec ---
    let qemu_args = vec![
        "-m", "1G",
        "-smp", "2",
        "-nographic",
        "-device", "virtio-net-pci,netdev=net0",
        "-netdev", "user,id=net0,hostfwd=tcp::2222-:22",
        "-drive", &drive_arg,
        "-monitor", "telnet::45454,server,nowait",
        "-serial", "mon:stdio",
    ];

    // Log the command for debugging
    activity::add_activity(format!("Launching QEMU with overlay: {}", overlay_name)).ok();

    // Emit event that QEMU is starting
    app_handle.emit("qemu-status", "started").ok();

    // --- Launch QEMU in a new terminal window ---
    let mut child = Command::new("cmd.exe")
        .args(["/C", "start", "QEMU VM", qemu_exe.to_str().unwrap()])
        .args(&qemu_args)
        .spawn()
        .map_err(|e| format!("Failed to launch QEMU: {}", e))?;

    // Spawn a thread to wait for the process to exit
    let app_clone = app_handle.clone();
    thread::spawn(move || {
        // Wait for the child process to complete
        match child.wait() {
            Ok(status) => {
                activity::add_activity(format!("QEMU exited with status: {}", status)).ok();
                // Emit event that QEMU has stopped
                app_clone.emit("qemu-status", "stopped").ok();
            }
            Err(e) => {
                activity::add_activity(format!("Error waiting for QEMU: {}", e)).ok();
                app_clone.emit("qemu-status", "error").ok();
            }
        }
    });

    Ok(())
}