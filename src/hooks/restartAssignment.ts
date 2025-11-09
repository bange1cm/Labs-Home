import { invoke } from "@tauri-apps/api/core"; 
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useState } from "react";
import { useActivityLog } from "./useActivityLog";


//not actually a hook because it will be called via a button click not on render
export function restartAssignment() {
    const { currentAssignment, loadAssignment } = useAssignmentCounter();
    const [restarted, setRestarted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivityLog();

    async function restart() {
        try {
            await loadAssignment();
            addActivity(`Attempting to restart Assignment ${currentAssignment}`);
            await invoke("restart_assignment");
            setRestarted(true);
            addActivity(`Successfully restarted Assignment ${currentAssignment}`);
        } catch (error) {
            setError(String(error));
            addActivity(`Failed to restart Assignment ${currentAssignment}: ${String(error)}`);
        }
    }


    return {restarted, error, restart, currentAssignment };
}