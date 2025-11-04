import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAssignmentCounter } from "./useAssignmentCounter";

// Custom hook to download the current assignment file.
export function useDownloadAssignment() {
    const { currentAssignment, loadAssignment } = useAssignmentCounter();
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const launchedRef = useRef(false);

    useEffect(() => {
        if (launchedRef.current) return; // guard against StrictMode double invoke
        launchedRef.current = true;

        async function downloadAssignment() {
            setDownloading(true);
            try {
                await loadAssignment();
                await invoke("download_assignment");
            } catch (e) {
                setError(String(e));
            } finally{
                setDownloading(false);
            }
        }

        downloadAssignment();
    }, [loadAssignment]);

    return{error, currentAssignment, downloading};
}