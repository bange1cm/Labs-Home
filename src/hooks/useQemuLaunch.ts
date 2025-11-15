import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useActivityLog } from "./useActivityLog";

//Custom hook to handle QEMU launch, polling, and error tracking.
export function useQemuLaunch() {
  const { currentAssignment, loadAssignment } = useAssignmentCounter();
  const { addActivity } = useActivityLog();

  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(true);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (launchedRef.current) return; // guard against StrictMode double invoke
    launchedRef.current = true;

    let unlisten: (() => void) | null = null;

    async function launchQemu() {
      try {
        // Set up event listener for QEMU status changes
        unlisten = await listen<string>("qemu-status", async (event) => {
          console.log("QEMU status changed:", event.payload);

          if (event.payload === "started") {
            setLaunching(true);
            setError(null);
          } else if (event.payload === "stopped") {
            setLaunching(false);
            await addActivity(`Closed Assignment ${currentAssignment ?? "?"}`);
          } else if (event.payload === "error") {
            setLaunching(false);
            setError("QEMU process encountered an error");
            await addActivity(`QEMU error detected`);
          }
        });

        // Load assignment and launch QEMU
        await loadAssignment();
        await invoke("launch_qemu");
      } catch (err: any) {
        setError(err?.message ?? String(err));
        await addActivity(
          `Frontend error launching QEMU: ${err?.message ?? err}`
        );
        setLaunching(false);
      }
    }

    launchQemu();

    // Cleanup: remove event listener when component unmounts
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [loadAssignment, currentAssignment, addActivity]);

  return { launching, error, currentAssignment };
}
