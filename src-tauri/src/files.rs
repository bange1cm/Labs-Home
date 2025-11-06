use tauri::Manager;
use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn download_assignment(app_handle: tauri::AppHandle) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());

    // log attempt
    let attempt_msg = format!("Attempting to download Assignment {}", current_assignment);
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

    // overlay filename and full path
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
    let overlay_path = qemu_data_dir
        .join("drives")
        .join("overlay")
        .join(&overlay_name);

    if !overlay_path.exists() {
        return Err(format!("Overlay file not found at: {}", overlay_path.display()));
    }

    // Get the user's Downloads directory
    let downloads_dir = dirs::download_dir()
        .ok_or_else(|| "Could not find Downloads directory".to_string())?;

    // Create the destination path to Downloads
    let dest_path = downloads_dir.join(&overlay_name);

    // Copy the file
    std::fs::copy(&overlay_path, &dest_path)
        .map_err(|e| format!("Failed to copy overlay file: {}", e))?;

    // Log success
    let success_msg = format!("Successfully downloaded Assignment {} to Downloads folder", current_assignment);
    let _ = crate::activity::add_activity(app_handle.clone(), success_msg.clone());

    Ok(())
}


#[tauri::command]
pub fn process_uploaded_file(file_name: String, file_bytes: Vec<u8>) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());
    let next_assignment = current_assignment + 1;

    // log attempt
    let attempt_msg = format!("Attempting to Upload Assignment {} Starting File", next_assignment);
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


    //
    


}