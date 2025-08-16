use std::{env, fs, io};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> Result<String, String> {
    let mut entries = fs::read_dir(".")
        .map_err(|e| e.to_string())?
        .map(|res| res.map(|e| e.path()).map_err(|e| e.to_string()))
        .collect::<Result<Vec<_>, String>>()?;

    entries.sort();

    // The entries have now been sorted by their path.
    Ok(format!(
        "Hello, `{:?}`! You've been greeted from Rust!",
        entries
    ))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
