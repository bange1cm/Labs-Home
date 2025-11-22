use std::fs;
use std::path::PathBuf;
use std::process::Command;

// Helper to get qemu-img executable path
fn get_qemu_img_path() -> Result<PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;
    
    let exe_dir = exe.parent()
        .ok_or("Failed to get parent directory of exe")?;
    
    // qemu-img.exe is in resources/qemu-img/ with its own DLLs
    let qemu_img_path = exe_dir.join("resources").join("qemu-img").join("qemu-img.exe");
    
    if !qemu_img_path.exists() {
        return Err(format!("qemu-img.exe not found at: {:?}", qemu_img_path));
    }
    
    Ok(qemu_img_path)
}
//private helper: get overlay path
fn get_overlay_path(assignment: u32) -> Result<PathBuf, String>{
    // get fron qemu.rs
    let drives_dir = crate::qemu::get_drives_dir()?;

    // overlay filename and full path
    let overlay_name = format!("overlay_a{}.qcow2", assignment);
    let overlay_path = drives_dir
        .join("overlay")
        .join(&overlay_name);

    Ok(overlay_path)
}

// helper: create new overlay file, also called to initialize 
pub fn create_overlay_file(drives_dir: &PathBuf, assignment: u32)-> Result<(), String> {
    let base_path = drives_dir.join("base").join("base.qcow2");
    let overlay_path: PathBuf = get_overlay_path(assignment)?;
    let qemu_img = get_qemu_img_path()?;

    let status_create = Command::new(qemu_img)
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
        Err(format!("Failed to create overlay file: overlay_a{}", assignment))
    }
}


#[tauri::command]
pub fn download_assignment() -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment()?;

    // overlay filename and full path
    let overlay_name = format!("overlay_a{}.qcow2", current_assignment);
    let overlay_path = get_overlay_path(current_assignment)?;

    if !overlay_path.exists() {
        return Err(format!("Overlay file not found at: {}", overlay_path.display()));
    }

    // Get the user's Downloads directory
    let downloads_dir = dirs::download_dir()
        .ok_or_else(|| "Could not find Downloads directory".to_string())?;

    // Create the destination path to Downloads
    let dest_path = downloads_dir.join(overlay_name);

    // Copy the file
    std::fs::copy(&overlay_path, &dest_path)
        .map_err(|e| format!("Failed to copy overlay file: {}", e))?;

    Ok(())
}


#[tauri::command]
pub fn process_uploaded_file(file_path: String) -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment()?;
    let next_assignment = current_assignment + 1;

    // get fron qemu.rs
    let drives_dir = crate::qemu::get_drives_dir()?;

    let professor_dir = drives_dir.join("professor");

    let base_path = drives_dir.join("base").join("base.qcow2");
    let qemu_img = get_qemu_img_path()?;

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
    let status_rebase = Command::new(&qemu_img)
        .arg("rebase")
        .arg("-u")
        .arg("-b")
        .arg(base_path.to_string_lossy().to_string())
        .arg(professor_path.to_string_lossy().to_string())
        .status()
        .map_err(|e| e.to_string())?;

    if !status_rebase.success() {
        return Err(format!("Failed to rebase starting file for Assignment {} with error {}", next_assignment, status_rebase));
    }

    //Commit using qemu-img
    let status_commit = Command::new(&qemu_img)
        .arg("commit")
        .arg(professor_path.to_string_lossy().to_string())
        .status()
        .map_err(|e| e.to_string())?;

    if !status_commit.success() {
        return Err(format!("Failed to commit starting file for Assignment {}", next_assignment));
    }

    //make a new overlay file for the next assignment
    create_overlay_file(&drives_dir, next_assignment)?; 

    //increment assignment
    let _ = crate::assignment::increment_assignment();

    Ok(())

}


#[tauri::command]
pub fn restart_assignment() -> Result<(), String> {
    // get current assignment
    let current_assignment = crate::assignment::get_assignment()?;

    // get fron qemu.rs
    let drives_dir = crate::qemu::get_drives_dir()?;

    // overlay full path
    let overlay_path = get_overlay_path(current_assignment)?;

    // Remove the overlay file
    if overlay_path.exists() {
        std::fs::remove_file(&overlay_path).map_err(|e| {format!("Failed to remove overlay file for Assignment {} with error: {}", current_assignment, e)})?;
    }
    else{
        return Err(format!("Overlay file not found: overlay_a{}", current_assignment));
    }

    // Create a new overlay file based on the base image
    create_overlay_file(&drives_dir, current_assignment)?;

    Ok(())
}

#[tauri::command]
pub fn reset_all_data() -> Result<(), String> {
    // Get qemu_data directory
    let drives_dir = crate::qemu::get_drives_dir()?;

    // Remove overlay directory
    let overlay_dir = drives_dir.join("overlay");
    if overlay_dir.exists() {
        std::fs::remove_dir_all(&overlay_dir).map_err(|e| {format!("Failed to remove overlay directory with error: {}", e)})?;
    }
    std::fs::create_dir_all(&overlay_dir).map_err(|e| {format!("Failed to create overlay directory with error: {}", e)})?;

    // Remove professor directory
    let professor_dir = drives_dir.join("professor");
    if professor_dir.exists() {
        std::fs::remove_dir_all(&professor_dir).map_err(|e| {format!("Failed to remove professor directory with error: {}", e)})?;
    }
    std::fs::create_dir_all(&professor_dir).map_err(|e| {format!("Failed to create professor directory with error: {}", e)})?;

    // Reset base image
    let base_path = drives_dir.join("base").join("base.qcow2");
    let original_base_path = drives_dir.join("base").join("base_original.qcow2");
    if original_base_path.exists() {
        std::fs::copy(&original_base_path, &base_path).map_err(|e| {format!("Failed to copy base image with error: {}", e)})?;
    } else {
        return Err("Original base image not found".to_string());
    }

    // Reset assignment counter to 1
    crate::assignment::reset_assignment();

    //create overlay for assignment 1
    create_overlay_file(&drives_dir, 1)?;

    Ok(())
}