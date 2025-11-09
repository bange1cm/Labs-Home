import { invoke } from "@tauri-apps/api/core"; 
import { useState } from "react";
import { useActivityLog } from "./useActivityLog";


//not actually a hook because it will be called via a button click not on render
export function resetAll() {
    const [reseted, setReseted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivityLog();

    async function reset() {
        try {
            addActivity(`Attempting to reset all data`);
            await invoke("reset_all_data");
            setReseted(true);
            addActivity(`Successfully reset all data`);
        } catch (error) {
            setError(String(error));
            addActivity(`Failed to reset all data: ${String(error)}`);
        }
    }


    return {reseted, error, reset};
}