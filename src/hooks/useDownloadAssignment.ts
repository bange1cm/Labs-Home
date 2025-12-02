import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useActivityLog } from "./useActivityLog";

// Custom hook to download the current assignment file.
export function useDownloadAssignment() {
  const { currentAssignment, loadAssignment } = useAssignmentCounter();
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [overlayName, setOverlayName] = useState<string | null>(null);
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
        const globalid = await invoke<string>("get_global_id");
        addActivity(`Attempting to save Assignment ${assignment}`);
        // placeholder overlay filename created here for UI display
        const name = `${globalid}_a${assignment}.qcow2`;
        setOverlayName(name);
        await invoke("download_assignment");
        addActivity(
          `Successfully saved Assignment ${assignment} as ${name} to Downloads folder`
        );
      } catch (e) {
        setError(String(e));
        addActivity(`Failed to save Assignment ${assignment}: ${String(e)}`);
      } finally {
        setDownloading(false);
      }
    }

    downloadAssignment();
  }, [loadAssignment]);

  return { error, currentAssignment, downloading, overlayName };
}
