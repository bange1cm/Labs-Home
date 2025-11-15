//store, read, and update assignment counter in a text file

//imports
use std::path::PathBuf;
use tauri::Manager;

//Private Helper: helper to get exe_dir
fn exe_dir() -> Result<std::path::PathBuf, String> {
    let exe = std::env::current_exe()
        .map_err(|e| format!("Failed to get current_exe: {}", e))?;

    let dir = exe.parent()
        .ok_or("Failed to get parent directory of exe")?;

    Ok(dir.to_path_buf())
}


// Private helper: Resolve assignment.txt in the read-only resources folder
fn assignment_file_path() -> Result<PathBuf, String> {
    let dir = exe_dir()?;
    Ok(dir.join("assignment.txt"))
}


// Private helper: read the counter from assignment.txt
fn load_counter() -> Result<u32, String> {
    let path = assignment_file_path()?;

    if !path.exists() {
        return Ok(1);
    }

    let contents = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    contents.trim().parse::<u32>()
        .map_err(|e| format!("Failed to parse number: {}", e))
}


// Private helper: save counter to file
fn save_counter(value: u32) -> Result<(), String> {
    let path = assignment_file_path()?;

    std::fs::write(path, value.to_string())
        .map_err(|e| format!("Failed to write assignment.txt: {}", e))
}

// Command: get current assignment counter
// In React use: invoke("get_assignment")
#[tauri::command]
pub fn get_assignment() -> Result<u32, String> {
    load_counter()
}

// Command: increment assignment counter
// In React use: invoke("increment_assignment")
#[tauri::command]
pub fn increment_assignment() -> Result<u32, String> {
    let mut counter = get_assignment()?;
    counter += 1;
    save_counter(counter)?;
    Ok(counter)
}

// Command: reset assignment counter to 1
// In React use: invoke("reset_assignment")
#[tauri::command]
pub fn reset_assignment() {
    let _ = save_counter(1);
}

//for testing purposes
#[tauri::command]
pub fn debug_all_paths(app: tauri::AppHandle) -> String {
    let mut out = String::new();

    out += &format!("Tauri executable_dir():  {:?}\n",
        app.path().executable_dir());
    out += &format!("Tauri resource_dir():    {:?}\n",
        app.path().resource_dir());
    out += &format!("std::env::current_exe(): {:?}\n",
        std::env::current_exe());
    out += &format!("std::env::current_dir(): {:?}\n",
        std::env::current_dir());

    out
}