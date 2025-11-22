//store, read, and update activity log entries in a json file

//imports
use serde::{Deserialize, Serialize}; //serde for serializing and deserializing json
use std::{collections::HashMap}; //hashmap for storing activity log entries
use std::fs;
use std::path::PathBuf;

//creating struct (dictionary)
#[derive(Serialize, Deserialize, Debug)]
pub struct ActivityLog(pub HashMap<String, String>);

//Private Helper: helper to get exe_dir
fn exe_dir() -> Result<std::path::PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;

    let dir = exe.parent()
        .ok_or("Failed to get parent directory of exe")?;

    Ok(dir.to_path_buf())
}


// Private helper: path helper
fn get_data_file() -> Result<PathBuf, String> {
    let dir = exe_dir()?;
    Ok(dir.join("resources").join("activity_log.json"))
}

// Private helper: read JSON log
fn read_log() -> Result<ActivityLog, String> {
    let path = get_data_file()?;

    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let log: ActivityLog = serde_json::from_str(&data).unwrap_or(ActivityLog(HashMap::new()));
    Ok(log)
}

// Private helper: write to JSON log
fn write_log(log: &ActivityLog) -> Result<(), String> {
    let path = get_data_file()?;
    let data = serde_json::to_string_pretty(log).map_err(|e| e.to_string())?;
    fs::write(path, data).map_err(|e| e.to_string())
}

// Command: load the current activity log
// In React use: invoke("load_log")
#[tauri::command]
pub fn load_log() -> Result<ActivityLog, String> {
    read_log()
}

// Command: add a new activity with timestamp
// In React use: invoke("add_activity", { description: "Did something" })
#[tauri::command]
pub fn add_activity(description: String) -> Result<ActivityLog, String> {
    use chrono::Utc;
    let mut log = read_log()?;
    let timestamp = Utc::now().to_rfc3339(); // current UTC timestamp
    log.0.insert(timestamp, description);
    write_log(&log)?;
    Ok(log) // return updated log
}