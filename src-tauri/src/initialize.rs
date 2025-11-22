use std::fs;
use std::path::PathBuf;
use crate::activity;
use crate::files;
use crate::playground;
use crate::qemu;

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
fn is_first_run() -> Result<bool, String> {
    let marker_path = get_marker_file_path()?;
    Ok(!marker_path.exists())
}

/// Perform first-time setup tasks
fn run_setup() -> Result<(), String> {
    activity::add_activity(format!("Running first time set up")).ok();
  
    //setup tasks
    //make qemu overlay for assignment 1
    let drives_dir = qemu::get_drives_dir()?;
    files::create_overlay_file(&drives_dir, 1)?; 
    //make playground overlay
    playground::create_overlay_file(&drives_dir)?;
    
    Ok(())
}

/// Create marker file to indicate setup is complete
fn mark_initialized() -> Result<(), String> {
    let marker_path = get_marker_file_path()?;
    
    // Create the marker file
    fs::write(&marker_path, "Initialized")
        .map_err(|e| format!("Failed to write marker file: {}", e))?;
    
    Ok(())
}

pub fn initialize() -> Result<(), String> {
    if is_first_run()? {
        run_setup()?; //makes overlay files and adds activity
        mark_initialized()?; //makes the marker file so the initialization is tracked
    }
    
    Ok(())
}
