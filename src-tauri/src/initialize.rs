use std::fs;
use std::path::PathBuf;
use crate::activity;
use crate::qemu;
use crate::files;
use crate::playground;

//Private Helper: helper to get exe_dir
fn exe_dir() -> Result<std::path::PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;

    let dir = exe.parent()
        .ok_or("Failed to get parent directory of exe")?;

    Ok(dir.to_path_buf())
}

/// Get path to the initialization marker file
fn get_marker_file_path() -> Result<PathBuf, String> {
    let dir = exe_dir()?;
    let resources_dir = dir.join("resources");
    
    // Create resources directory if it doesn't exist
    if !resources_dir.exists() {
        std::fs::create_dir_all(&resources_dir)
            .map_err(|e| format!("Failed to create resources directory: {}", e))?;
    }
    
    Ok(resources_dir.join("initialized.txt"))
}

/// Check if this is the first time the app is running
#[tauri::command]
pub fn is_first_run() -> Result<bool, String> {
    let marker_path = get_marker_file_path()?;
    Ok(!marker_path.exists())
}

/// Perform first-time setup tasks
fn run_setup(globalid: String) -> Result<(), String> {
    activity::add_activity(format!("Running first time set up")).ok();

    write_global_id_marker(&globalid)?;
  
    //setup tasks
    let drives_dir = qemu::get_drives_dir().map_err(|e| {
        let err = format!("Failed to get drives_dir: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    
    //make qemu overlay for assignment 1
    files::create_overlay_file(&drives_dir, 1).map_err(|e| {
        let err = format!("Failed to create overlay file for assignment 1: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    
    //make playground overlay
    playground::create_overlay_file(&drives_dir).map_err(|e| {
        let err = format!("Failed to create playground overlay: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    
    activity::add_activity(format!("Setup tasks completed successfully")).ok();
    Ok(())
}

// Private helper: write the global ID into the first line of initialized.txt
fn write_global_id_marker(global_id: &str) -> Result<(), String> {
    let marker_path = get_marker_file_path()?;
    // Write global_id as first line followed by an initialization marker
    let content = format!("{}\nInitialized", global_id);
    fs::write(&marker_path, content).map_err(|e| format!("Failed to write initialization file: {}", e))?;
    Ok(())
}

// Public helper: read the global ID from the first line of initialized.txt
#[tauri::command]
pub fn get_global_id() -> Result<String, String> {
    let marker_path = get_marker_file_path()?;
    
    // Check if file exists; if not, return a clear error
    if !marker_path.exists() {
        return Err("Application not yet initialized".to_string());
    }
    
    let contents = fs::read_to_string(&marker_path)
        .map_err(|e| format!("Failed to read marker file: {}", e))?;
    let first = contents.lines().next().unwrap_or("").trim().to_string();
    if first.is_empty() {
        Err("Global ID not found in marker file".to_string())
    } else {
        Ok(first)
    }
}

// Run initialization (callable from frontend)
#[tauri::command]
pub fn run_initialization(globalid: String) -> Result<(), String> {
    run_setup(globalid)?;
    activity::add_activity(format!("Initialization complete")).ok();
    Ok(())
}