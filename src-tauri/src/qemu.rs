use std::process::Command;
use tauri::{Manager};

// In React use: invoke("launch_qemu")
#[tauri::command]
pub fn launch_qemu(app_handle: tauri::AppHandle) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());

    // log attempt
    let attempt_msg = format!("Attempting to launch Assignment {}", current_assignment);
    let _ = crate::activity::add_activity(app_handle.clone(), attempt_msg.clone());

    // Discover qemu_data folder: resource_dir, exe parents, cwd
    let mut qemu_candidates: Vec<std::path::PathBuf> = Vec::new();
    if let Ok(rd) = app_handle.path().resource_dir() {
        qemu_candidates.push(rd.join("qemu_data"));
    }
    if let Ok(mut p) = std::env::current_exe() {
        while let Some(parent) = p.parent() {
            qemu_candidates.push(parent.join("qemu_data"));
            p = parent.to_path_buf();
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        qemu_candidates.push(cwd.join("qemu_data"));
    }

    let qemu_data_dir = qemu_candidates
        .into_iter()
        .find(|p| p.exists())
        .ok_or_else(|| "Failed to locate qemu_data directory".to_string())?;

    // overlay filename
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);

    // Windows: use the project's batch with START so the console output is visible,
    // then monitor processes for the overlay filename via PowerShell to detect exit.
    if cfg!(target_os = "windows") {
        let batch_path = qemu_data_dir.join("launch_qemu.bat");

        let overlay_name = overlay_name.clone();

        // Build START invocation: start "" /D <qemu_data_dir> cmd /k call <batch> <overlay>
        let wd_str = qemu_data_dir.to_string_lossy().to_string();
        let batch_filename = batch_path
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
            .ok_or_else(|| "Invalid batch path".to_string())?;

        let mut launcher = Command::new("cmd");
        let args_vec = vec![
            "/C".to_string(),
            "start".to_string(),
            "".to_string(),
            "/D".to_string(),
            wd_str.clone(),
            "cmd".to_string(),
            "/k".to_string(),
            "call".to_string(),
            batch_filename.clone(),
            overlay_name.clone(),
        ];
        launcher.args(&args_vec);

        match launcher.spawn() {
            Ok(_child) => {
                let msg = format!("Launched Assignment {}", current_assignment);
                let _ = crate::activity::add_activity(app_handle.clone(), msg.clone());
                Ok(())
            }
            Err(e) => {
                let msg = format!("Error launching Assignment {}: {}", current_assignment, e);
                let _ = crate::activity::add_activity(app_handle.clone(), msg.clone());
                Err(msg)
            }
        }
    } else { // macOS
        // attempt to use bundled overlay path, then open Terminal via osascript
        let overlay_path = qemu_data_dir.join("drives").join("overlay").join(&overlay_name);
        let overlay_arg = if overlay_path.exists() {
            overlay_path.to_string_lossy().to_string()
        } else {
            overlay_name.clone()
        };

        let qemu_cmd = format!(
            "qemu-system-x86_64 -m 1G -smp 2 -nographic -device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22 -drive if=virtio,format=qcow2,file=\"{}\" -monitor telnet::45454,server,nowait -serial mon:stdio",
            overlay_arg
        );

        // escape for osascript
        let qemu_cmd_escaped = qemu_cmd.replace('"', "\\\"");
        let apple_cmd = format!("tell application \"Terminal\" to do script \"{}\"", qemu_cmd_escaped);

        let mut launcher = Command::new("osascript");
        launcher.args(["-e", &apple_cmd]);

        match launcher.spawn() {
            Ok(_child) => {
                let msg = format!("Launched Assignment {} (macOS)", current_assignment);
                let _ = crate::activity::add_activity(app_handle.clone(), msg.clone());
                Ok(())
            }
            Err(e) => {
                let msg = format!("Error launching Assignment {} on macOS: {}", current_assignment, e);
                let _ = crate::activity::add_activity(app_handle.clone(), msg.clone());
                Err(msg)
            }
        }
    } 
}

// Command the frontend can poll to check whether the current assignment's QEMU
// process is still running. Returns true if a matching process is found.
#[tauri::command]
pub fn is_qemu_running(app_handle: tauri::AppHandle) -> Result<bool, String> {
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);

    if cfg!(target_os = "windows") {
        // Use `tasklist` to check for known QEMU process image names. This is
        // more robust than relying on CommandLine matching which can pick up
        // wrapper shells (cmd.exe) and leave false positives.
        let candidates = [
            "qemu-system-x86_64.exe",
            "qemu-system-x86.exe",
            "qemu.exe",
        ];
        for name in candidates.iter() {
            // /NH removes header, /FI applies filter, output will contain the image name if present
            if let Ok(out) = Command::new("tasklist").args(["/FI", &format!("IMAGENAME eq {}", name), "/NH"]).output() {
                let s = String::from_utf8_lossy(&out.stdout).to_string();
                if s.to_lowercase().contains(&name.to_lowercase()) {
                    return Ok(true);
                }
            }
        }
        Ok(false)
    } else if cfg!(target_os = "macos") {
        match Command::new("pgrep").args(["-f", &overlay_name]).output() {
            Ok(out) => Ok(out.status.success()),
            Err(e) => Err(format!("pgrep error: {}", e)),
        }
    } else {
        // Fallback: check for qemu-system-x86_64 process presence
        match Command::new("pgrep").args(["-f", "qemu-system-x86_64"]).output() {
            Ok(out) => Ok(out.status.success()),
            Err(e) => Err(format!("pgrep error: {}", e)),
        }
    }
}
