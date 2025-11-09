use tauri::Manager;
use std::fs;
use std::path::PathBuf;
use std::process::Command;

// Private helper: qemu_dir helper
fn qemu_data_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
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

    qemu_candidates
        .into_iter()
        .find(|p| p.exists())
        .ok_or_else(|| "Failed to locate qemu_data directory".to_string())
}

//Private helper: create new overlay file
fn create_overlay_file(qemu_data_dir: &PathBuf, overlay_name: &str)-> Result<(), String> {
    let base_path = qemu_data_dir.join("drives").join("base").join("base.qcow2");
    let overlay_path = qemu_data_dir.join("drives").join("overlay").join(overlay_name);

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
        Err(format!("Failed to create overlay file {}", overlay_name))
    }
}


#[tauri::command]
pub fn download_assignment(app_handle: tauri::AppHandle) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());

    // Discover qemu_data folder: resource_dir, exe parents, cwd
    let qemu_data_dir = qemu_data_dir(&app_handle)?;

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

    Ok(())
}


#[tauri::command]
pub fn process_uploaded_file(app_handle: tauri::AppHandle, file_path: String) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());
    let next_assignment = current_assignment + 1;

    // Get qemu_data directory
    let qemu_data_dir = qemu_data_dir(&app_handle)?;

    let professor_dir = qemu_data_dir.join("drives").join("professor");

    let base_path = qemu_data_dir.join("drives").join("base").join("base.qcow2");

    //receive the file path 
    let source_path = PathBuf::from(&file_path);
    if !source_path.exists() {
        return Err(format!("Source file not found: {}", file_path));
    }

    let professor_path: PathBuf = professor_dir
        .join(source_path.file_name().ok_or_else(|| "Invalid source file name".to_string())?);
    
    //copy file
    fs::copy(&source_path, &professor_path)
        .map_err(|e| format!("Failed to copy starting file: {}", e))?;

    // Rebase using qemu-img
    let status_rebase = Command::new("qemu-img")
        .arg("rebase")
        .arg("-u")
        .arg("-b")
        .arg(base_path.to_string_lossy().to_string())
        .arg(professor_path.to_string_lossy().to_string())
        .current_dir(&qemu_data_dir) // set the working directory
        .status()
        .map_err(|e| e.to_string())?;

    if !status_rebase.success() {
        return Err(format!("Failed to rebase starting file for Assignment {} with error {}", next_assignment, status_rebase));
    }

    //Commit using qemu-img
    let status_commit = Command::new("qemu-img")
        .arg("commit")
        .arg(professor_path.to_string_lossy().to_string())
        .status()
        .map_err(|e| e.to_string())?;

    if !status_commit.success() {
        return Err(format!("Failed to commit starting file for Assignment {}", next_assignment));
    }

    //make a new overlay file for the next assignment
    let new_overlay_name = format!("overlay_a{}.qcow2", next_assignment);
    create_overlay_file(&qemu_data_dir, &new_overlay_name)?; 

    //increment assignment
    crate::assignment::increment_assignment(app_handle.clone());

    Ok(())

}


#[tauri::command]
pub fn restart_assignment(app_handle: tauri::AppHandle) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment(app_handle.clone());

    // Get qemu_data directory
    let qemu_data_dir = qemu_data_dir(&app_handle)?;

    // overlay filename and full path
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
    let overlay_path = qemu_data_dir
        .join("drives")
        .join("overlay")
        .join(overlay_name);

    // Remove the overlay file
    if overlay_path.exists() {
        std::fs::remove_file(&overlay_path).map_err(|e| {format!("Failed to remove overlay file for Assignment {} with error: {}", current_assignment, e)})?;
    }
    else{
        return Err(format!("Overlay file for Assignment {} does not exist at: {}", current_assignment, overlay_path.display()));
    }

    // Create a new overlay file based on the base image
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
    create_overlay_file(&qemu_data_dir, &overlay_name)?;

    Ok(())
}

#[tauri::command]
pub fn reset_all_data(app_handle: tauri::AppHandle) -> Result<(), String> {
    // Get qemu_data directory
    let qemu_data_dir = qemu_data_dir(&app_handle)?;

    // Remove overlay directory
    let overlay_dir = qemu_data_dir.join("drives").join("overlay");
    if overlay_dir.exists() {
        std::fs::remove_dir_all(&overlay_dir).map_err(|e| {format!("Failed to remove overlay directory with error: {}", e)})?;
    }
    std::fs::create_dir_all(&overlay_dir).map_err(|e| {format!("Failed to create overlay directory with error: {}", e)})?;

    // Remove professor directory
    let professor_dir = qemu_data_dir.join("drives").join("professor");
    if professor_dir.exists() {
        std::fs::remove_dir_all(&professor_dir).map_err(|e| {format!("Failed to remove professor directory with error: {}", e)})?;
    }
    std::fs::create_dir_all(&professor_dir).map_err(|e| {format!("Failed to create professor directory with error: {}", e)})?;

    // Reset base image
    let base_path = qemu_data_dir.join("drives").join("base").join("base.qcow2");
    let original_base_path = qemu_data_dir.join("drives").join("base").join("base_original.qcow2");
    if original_base_path.exists() {
        std::fs::copy(&original_base_path, &base_path).map_err(|e| {format!("Failed to copy base image with error: {}", e)})?;
    } else {
        return Err("Original base image not found".to_string());
    }

    // Reset assignment counter to 1
    crate::assignment::reset_assignment(app_handle.clone());

    //create overlay for assignment 1
    let overlay_name = format!("overlay_a1.qcow2");
    create_overlay_file(&qemu_data_dir, &overlay_name)?;

    Ok(())
}