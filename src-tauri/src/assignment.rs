//store, read, and update assignment counter in a text file

//imports
use std::path::PathBuf;
use tauri::Manager;
use tauri::path::BaseDirectory;

// Private helper: Resolve assignment.txt in the read-only resources folder
fn assignment_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .resolve("assignment.txt", BaseDirectory::Executable)
        .map_err(|e| format!("Failed to resolve assignment.txt next to exe: {}", e))
}

// Private helper: read the counter from assignment.txt
fn load_counter(app: &tauri::AppHandle) -> Result<u32, String> {
    let path = assignment_file_path(app)?;
    if !path.exists() {
        return Ok(1);
    }

    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read assignment.txt: {}", e))?;

    content.trim().parse::<u32>()
        .map_err(|e| format!("Failed to parse counter: {}", e))
}

// Private helper: save counter to file
fn save_counter(app: &tauri::AppHandle, value: u32) -> Result<(), String> {
    let path = assignment_file_path(app)?;

    std::fs::write(path, value.to_string())
        .map_err(|e| format!("Failed to write assignment.txt: {}", e))
}

// Command: get current assignment counter
// In React use: invoke("get_assignment")
#[tauri::command]
pub fn get_assignment(app: tauri::AppHandle) -> Result<u32, String> {
    load_counter(&app)
}

// Command: increment assignment counter
// In React use: invoke("increment_assignment")
#[tauri::command]
pub fn increment_assignment(app: tauri::AppHandle) -> Result<u32, String> {
    let mut counter = get_assignment(&app)?;
    counter += 1;
    save_counter(&app, counter)?;
    Ok(counter)
}

// Command: reset assignment counter to 1
// In React use: invoke("reset_assignment")
#[tauri::command]
pub fn reset_assignment(app_handle: tauri::AppHandle) {
    save_counter(&app_handle, 1);
}
