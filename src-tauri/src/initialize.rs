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
    Ok(resources_dir.join("initialized.txt"))
}

/// Check if this is the first time the app is running
#[tauri::command]
pub fn is_first_run() -> Result<bool, String> {
    let marker_path = get_marker_file_path()?;
    Ok(!marker_path.exists())
}

/// Perform first-time setup tasks
fn run_setup() -> Result<(), String> {
    activity::add_activity(format!("Running first time set up")).ok();
  
    //setup tasks
    activity::add_activity(format!("Step 1: Getting drives directory")).ok();
    let drives_dir = qemu::get_drives_dir().map_err(|e| {
        let err = format!("Failed to get drives_dir: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    activity::add_activity(format!("Drives directory: {:?}", drives_dir)).ok();
    
    //make qemu overlay for assignment 1
    activity::add_activity(format!("Step 2: Creating overlay file for assignment 1")).ok();
    files::create_overlay_file(&drives_dir, 1).map_err(|e| {
        let err = format!("Failed to create overlay file for assignment 1: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    activity::add_activity(format!("Successfully created overlay for assignment 1")).ok();
    
    //make playground overlay
    activity::add_activity(format!("Step 3: Creating playground overlay")).ok();
    playground::create_overlay_file(&drives_dir).map_err(|e| {
        let err = format!("Failed to create playground overlay: {}", e);
        activity::add_activity(err.clone()).ok();
        e
    })?;
    activity::add_activity(format!("Successfully created playground overlay")).ok();
    
    activity::add_activity(format!("Setup tasks completed successfully")).ok();
    Ok(())
}

/// Create marker file to indicate setup is complete
fn mark_initialized() -> Result<(), String> {
    let marker_path = get_marker_file_path()?;
    
    // Create the marker file
    fs::write(&marker_path, "Initialized")
        .map_err(|e| format!("Failed to write marker file: {}", e))?;
    
    activity::add_activity(format!("Marked as initialized")).ok();
    Ok(())
}

// Run initialization (callable from frontend)
#[tauri::command]
pub fn run_initialization() -> Result<(), String> {
    activity::add_activity(format!("run_initialization called")).ok();
    run_setup()?;
    mark_initialized()?;
    activity::add_activity(format!("Initialization complete")).ok();
    Ok(())
}