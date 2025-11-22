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
mod playground;
mod initialize;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![ 
            activity::load_log,
            activity::add_activity,
            assignment::get_assignment,
            assignment::increment_assignment,
            assignment::reset_assignment,
            assignment::debug_all_paths,
            qemu::launch_qemu,
            files::download_assignment,
            files::process_uploaded_file,
            files::restart_assignment,
            files::reset_all_data,
            playground::reset_playground,
            playground::launch_playground,
            initialize::run_initialization,
            initialize::is_first_run,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
