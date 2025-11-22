use std::process::Command;
use std::os::windows::process::CommandExt;
use tauri::{Emitter};
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
use std::fs;
const CREATE_NEW_CONSOLE: u32 = 0x00000010;
const CREATE_NO_WINDOW: u32 = 0x08000000;

//private helper: only one overlay exists
fn get_overlay_path() -> Result<PathBuf, String>{
    // get fron qemu.rs
    let drives_dir = crate::qemu::get_drives_dir()?;

    let overlay_path = drives_dir
        .join("playground")
        .join("overlay_playground.qcow2");

    Ok(overlay_path)
}

// helper: create a new overlay, also use to initialize
pub fn create_overlay_file(drives_dir: &PathBuf)-> Result<(), String> {
    let base_path = drives_dir.join("base").join("base.qcow2");
    let overlay_path: PathBuf = get_overlay_path()?;

    let status_create = Command::new("qemu-img")
        .arg("create")
        .arg("-f")
        .arg("qcow2")
        .arg("-F")
        .arg("qcow2")
        .arg("-b")
        .arg(base_path.to_string_lossy().to_string())
        .arg(overlay_path.to_string_lossy().to_string())
        .status()
        .map_err(|e| e.to_string())?;

    if status_create.success() {
        Ok(())
    } else {
        Err("Failed to create playground overlay file".to_string())
    }
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

//launch_playground
#[tauri::command]
pub fn launch_playground(app_handle: tauri::AppHandle) -> Result<(), String> {

    let win64_dir = crate::qemu::get_win64_dir(app_handle.clone())?;

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
      let overlay_path: PathBuf = get_overlay_path()?;
    if !overlay_path.exists() {
        return Err(format!("Overlay disk not found: {:?}", overlay_path));
    }
    let overlay_path_str = overlay_path
        .to_str()
        .ok_or("Invalid overlay path")?
        .trim_start_matches(r"\\?\");

    //use batch file to launch new terminal
    let batch_file = std::env::temp_dir().join(format!("launch_qemu_playground.bat"));
    let batch_content = format!(
        "@echo off\r\n\
        title QEMU Playground\r\n\
        echo Starting QEMU...\r\n\
        echo.\r\n\
        \"{}\" -m 1G -smp 2 -nographic -device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22 -drive if=virtio,format=qcow2,file=\"{}\" -monitor telnet::45454,server,nowait -serial mon:stdio\r\n\
        echo.\r\n\
        echo QEMU has exited.\r\n\
        echo Press any key to close this window...\r\n\
        pause > nul\r\n\
        del \"%~f0\"\r\n",
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


//reset_playground
#[tauri::command]
pub fn reset_playground() -> Result<(), String> {

    // get fron qemu.rs
    let drives_dir = crate::qemu::get_drives_dir()?;

    // overlay full path
    let overlay_path = get_overlay_path()?;

    // Remove the overlay file
    if overlay_path.exists() {
        std::fs::remove_file(&overlay_path).map_err(|e| {format!("Failed to remove overlay file for the Playground with error: {}", e)})?;
    }
    else{
        return Err(format!("Overlay file not found: overlay_playground"));
    }

    // Create a new overlay file based on the base image
    create_overlay_file(&drives_dir)?;

    Ok(())
}