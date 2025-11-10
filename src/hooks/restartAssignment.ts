import { invoke } from "@tauri-apps/api/core"; 
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useState } from "react";
import { useActivityLog } from "./useActivityLog";


//not actually a hook because it will be called via a button click not on render
export function restartAssignment() {
    const { loadAssignment } = useAssignmentCounter();
    const [restarted, setRestarted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivityLog();
    let assignment: number | null = null;

    async function restart() {
        try {
            assignment = await loadAssignment();
            addActivity(`Attempting to restart Assignment ${assignment}`);
            await invoke("restart_assignment");
            setRestarted(true);
            addActivity(`Successfully restarted Assignment ${assignment}`);
        } catch (error) {
            setError(String(error));
            addActivity(`Failed to restart Assignment ${assignment}: ${String(error)}`);
        }
    }


    return {restarted, error, restart };
}