import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
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

    async function launchQemu() {
      let loadedAssignment: number | null = null;

      try {
        // Load assignment and save the result for activity logging
        loadedAssignment = await loadAssignment();
        await invoke("launch_qemu");

        // Poll backend periodically to detect when QEMU closes
        let pollHandle: number | null = null;

        try {
          await new Promise((r) => setTimeout(r, 500)); // brief delay before polling

          pollHandle = window.setInterval(async () => {
            try {
              // @ts-ignore - invoke typing sometimes loose
              const res = await invoke("is_qemu_running");
              const running = !!res;

              if (!running) {
                setLaunching(false);
                await addActivity(
                  `Closed Assignment ${loadedAssignment ?? currentAssignment ?? "?"}`
                );
                if (pollHandle) {
                  clearInterval(pollHandle);
                  pollHandle = null;
                }
              }
            } catch (e) {
              setError(String(e));
              await addActivity(`Error polling QEMU status: ${e}`);
            }
          }, 1000);
        } catch (e) {
          setError(String(e));
          await addActivity(`Error setting up QEMU polling: ${e}`);
        }
      } catch (err: any) {
        setError(err?.message ?? String(err));
        await addActivity(`Frontend error launching QEMU: ${err?.message ?? err}`);
        setLaunching(false);
      }
    }

    launchQemu();
  }, [loadAssignment]);

  return { launching, error, currentAssignment };
}
