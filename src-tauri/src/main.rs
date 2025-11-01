// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//entry point of rust 
fn main() {
    labsathome_lib::run()
}
