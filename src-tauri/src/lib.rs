// // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

//lib is the central tauri module that pulls in all other modules
//all functions that need to be exposed to the frontend via invoke_handler need to be listed here

//other modules
mod activity;
mod assignment;
mod files;
mod qemu;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![ 
            activity::load_log,
            activity::add_activity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
