//store, read, and update assignment counter in a text file

//imports
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

// Private helper: path helper
fn assignment_file_path(app_handle: &tauri::AppHandle) -> PathBuf {
    let dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");
    fs::create_dir_all(&dir).unwrap();
    dir.join("assignment.txt")
}

//Private helper: load counter from file, return 1 if missing
fn load_counter(app_handle: &tauri::AppHandle) -> u32 {
    let path = assignment_file_path(app_handle);
    if !path.exists() {
        return 1;
    }
    let content = fs::read_to_string(path).unwrap_or_default();
    content.trim().parse::<u32>().unwrap_or(0)
}

//Private helper: save counter to file
fn save_counter(app_handle: &tauri::AppHandle, counter: u32) {
    let path = assignment_file_path(app_handle);
    fs::write(path, counter.to_string()).unwrap();
}

// Command: get current assignment counter
// In React use: invoke("get_assignment")
#[tauri::command]
pub fn get_assignment(app_handle: tauri::AppHandle) -> u32 {
    load_counter(&app_handle)
}

// Command: increment assignment counter
// In React use: invoke("increment_assignment")
#[tauri::command]
pub fn increment_assignment(app_handle: tauri::AppHandle) -> u32 {
    let mut counter = load_counter(&app_handle);
    counter += 1;
    save_counter(&app_handle, counter);
    counter
}

// Command: reset assignment counter to 1
// In React use: invoke("reset_assignment")
#[tauri::command]
pub fn reset_assignment(app_handle: tauri::AppHandle) {
    save_counter(&app_handle, 1);
}
