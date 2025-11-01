//imports
use std::process::Command;

//Command to launch QEMU with the current assignment
#[tauri::command]
pub fn launch_qemu(app_handle: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;

    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());

    // log attempt
    let attempt_msg = format!("Attempting to launch Assignment {}", current_assignment);
    let _ = crate::activity::add_activity(app_handle.clone(), attempt_msg.clone());

    // (overlay filename will be built later when invoking the batch)

    // Discover the project's `qemu_data` directory (try resource dir, exe parents, then cwd)
    let mut qemu_data_candidates: Vec<std::path::PathBuf> = Vec::new();
    if let Ok(rd) = app_handle.path().resource_dir() {
        qemu_data_candidates.push(rd.join("qemu_data"));
    }
    if let Ok(mut p) = std::env::current_exe() {
        while let Some(parent) = p.parent() {
            qemu_data_candidates.push(parent.join("qemu_data"));
            p = parent.to_path_buf();
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        qemu_data_candidates.push(cwd.join("qemu_data"));
    }

    let qemu_data_dir = qemu_data_candidates
        .into_iter()
        .find(|p| p.exists())
        .ok_or_else(|| "Failed to locate qemu_data directory".to_string())?;

    // Platform-specific launchers
    if cfg!(target_os = "windows") {
    // For Windows: look under qemu_data/win64 for the batch and exe
    let batch_path = qemu_data_dir.join("launch_qemu.bat");

        if !batch_path.exists() {
            let msg = format!("launch_qemu.bat not found at {}", batch_path.display());
            let _ = crate::activity::add_activity(app_handle.clone(), msg.clone());
            return Err(msg);
        }

        // Pass overlay filename (e.g. overlay_a1.qcow2)
        let overlay_name = format!("overlay_a{}.qcow2", current_assignment);

        // Use START with /D to set working directory and pass argv pieces separately
        let wd = qemu_data_dir.clone();
        let wd_str = wd.to_string_lossy().to_string();
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
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Ok(());
            }
            Err(e) => {
                let msg = format!("Error launching Assignment {}: {}", current_assignment, e);
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Err(msg);
            }
        }
    } else if cfg!(target_os = "macos") {
        // macOS: prefer qemu on PATH; overlay file is located in qemu_data/drives/overlay
        let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
        let overlay_path = qemu_data_dir.join("drives").join("overlay").join(&overlay_name);
        let overlay_arg = if overlay_path.exists() {
            overlay_path.to_string_lossy().to_string()
        } else {
            // fallback to overlay filename only (user might run from project dir)
            overlay_name.clone()
        };

        // Build qemu command
        let qemu_cmd = format!(
            "qemu-system-x86_64 -m 1G -smp 2 -nographic -device virtio-net-pci,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22 -drive if=virtio,format=qcow2,file=\"{}\" -monitor telnet::45454,server,nowait -serial mon:stdio",
            overlay_arg
        );

        // Escape double quotes for osascript
        let qemu_cmd_escaped = qemu_cmd.replace('\"', "\\\"").replace('"', "\\\"");

        // Tell Terminal.app to run the command (keeps window open)
        let apple_cmd = format!("tell application \"Terminal\" to do script \"{}\"", qemu_cmd_escaped);

        let mut launcher = Command::new("osascript");
        launcher.args(["-e", &apple_cmd]);

        match launcher.spawn() {
            Ok(_child) => {
                let msg = format!("Launched Assignment {} (macOS)", current_assignment);
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Ok(());
            }
            Err(e) => {
                let msg = format!("Error launching Assignment {} on macOS: {}", current_assignment, e);
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Err(msg);
            }
        }
    } else {
        // Other platforms: attempt to run qemu-system-x86_64 directly in background (best-effort)
        let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
        let overlay_path = qemu_data_dir.join("drives").join("overlay").join(&overlay_name);
        let overlay_arg = if overlay_path.exists() {
            overlay_path.to_string_lossy().to_string()
        } else {
            overlay_name.clone()
        };

        let mut launcher = Command::new("qemu-system-x86_64");
        launcher.args([
            "-m",
            "1G",
            "-smp",
            "2",
            "-nographic",
            "-device",
            "virtio-net-pci,netdev=net0",
            "-netdev",
            "user,id=net0,hostfwd=tcp::2222-:22",
            "-drive",
            &format!("if=virtio,format=qcow2,file={}", overlay_arg),
            "-monitor",
            "telnet::45454,server,nowait",
            "-serial",
            "mon:stdio",
        ]);

        match launcher.spawn() {
            Ok(_child) => {
                let msg = format!("Launched Assignment {} (direct)", current_assignment);
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Ok(());
            }
            Err(e) => {
                let msg = format!("Error launching Assignment {}: {}", current_assignment, e);
                let _ = crate::activity::add_activity(app_handle, msg.clone());
                return Err(msg);
            }
        }
    }

}
