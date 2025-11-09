import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useActivityLog } from "./useActivityLog";

// Custom hook to download the current assignment file.
export function useDownloadAssignment() {
    const { currentAssignment, loadAssignment } = useAssignmentCounter();
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const launchedRef = useRef(false);
    const { addActivity } = useActivityLog();

    useEffect(() => {
        if (launchedRef.current) return; // guard against StrictMode double invoke
        launchedRef.current = true;
        let assignment: number | null = null;

        async function downloadAssignment() {
            setDownloading(true);
            try {
                const assignment = await loadAssignment();
                addActivity(`Attempting to download Assignment ${assignment}`);
                await invoke("download_assignment");
                addActivity(`Successfully downloaded Assignment ${assignment} to Downloads folder`);
            } catch (e) {
                setError(String(e));
                addActivity(`Failed to download Assignment ${assignment}: ${String(e)}`);
            } finally{
                setDownloading(false);
            }
        }

        downloadAssignment();
    }, [loadAssignment]);

    return{error, currentAssignment, downloading};
}