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
    let assignment : number | null = null;

    async function upload() {
        try {
        assignment = await loadAssignment();
            addActivity(`Starting upload for Assignment ${assignment != null ? assignment + 1 : "?"}`);
            await invoke("process_uploaded_file", {
                filePath: selectedFilePath,
                assignmentNumber: assignment,
            });
            setUploaded(true);
            addActivity(`Successfully uploaded file for Assignment ${assignment != null ? assignment + 1 : "?"}`);
        } catch (error) {
            setError(String(error));
            addActivity(`Failed to upload file for Assignment ${assignment != null ? assignment + 1 : "?"}: ${String(error)}`);
        }
    }


    return {upload, error, uploaded, currentAssignment };
}