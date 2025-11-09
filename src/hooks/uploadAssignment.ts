import { invoke } from "@tauri-apps/api/core"; 
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useState } from "react";
import { useActivityLog } from "./useActivityLog";

//not actually a hook because it will be called via a button click not on render
export function uploadAssignment(selectedFilePath: string | null) {
    const { currentAssignment, loadAssignment } = useAssignmentCounter();
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addActivity } = useActivityLog();

    async function upload() {
        try {
            await loadAssignment();
            addActivity(`Starting upload for Assignment ${currentAssignment != null ? currentAssignment + 1 : "?"}`);
            await invoke("process_uploaded_file", {
                filePath: selectedFilePath,
                assignmentNumber: currentAssignment,
            });
            setUploaded(true);
            addActivity(`Successfully uploaded file for Assignment ${currentAssignment}`);
        } catch (error) {
            setError(String(error));
            addActivity(`Failed to upload file: ${String(error)}`);
        }
    }


    return {upload, error, uploaded, currentAssignment };
}