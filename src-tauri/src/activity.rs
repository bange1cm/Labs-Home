//store, read, and update activity log entries in a json file

//imports
use serde::{Deserialize, Serialize}; //serde for serializing and deserializing json
use std::{collections::HashMap}; //hashmap for storing activity log entries
use tauri::AppHandle;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

//creating struct (dictionary)
#[derive(Serialize, Deserialize, Debug)]
pub struct ActivityLog(pub HashMap<String, String>);

// Private helper: path helper
fn get_data_file(app_handle: &AppHandle) -> PathBuf {
    let dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");
    fs::create_dir_all(&dir).unwrap();
    dir.join("activity_log.json")
}

// Private helper: read JSON log, return empty if file missing
fn read_log(app_handle: &AppHandle) -> Result<ActivityLog, String> {
    let path = get_data_file(app_handle);
    if !path.exists() {
        return Ok(ActivityLog(HashMap::new()));
    }
    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let log: ActivityLog = serde_json::from_str(&data).unwrap_or(ActivityLog(HashMap::new()));
    Ok(log)
}

// Private helper: write to JSON log
fn write_log(app_handle: &AppHandle, log: &ActivityLog) -> Result<(), String> {
    let path = get_data_file(app_handle);
    let data = serde_json::to_string_pretty(log).map_err(|e| e.to_string())?;
    fs::write(path, data).map_err(|e| e.to_string())
}

// Command: load the current activity log
// In React use: invoke("load_log")
#[tauri::command]
pub fn load_log(app_handle: AppHandle) -> Result<ActivityLog, String> {
    read_log(&app_handle)
}

// Command: add a new activity with timestamp
// In React use: invoke("add_activity", { description: "Did something" })
#[tauri::command]
pub fn add_activity(app_handle: AppHandle, description: String) -> Result<ActivityLog, String> {
    use chrono::Utc;
    let mut log = read_log(&app_handle)?;
    let timestamp = Utc::now().to_rfc3339(); // current UTC timestamp
    log.0.insert(timestamp, description);
    write_log(&app_handle, &log)?;
    Ok(log) // return updated log
}