import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useAssignmentCounter } from "./useAssignmentCounter";
import { useActivityLog } from "./useActivityLog";

export function useQemuLaunch() {
  const { currentAssignment, loadAssignment } = useAssignmentCounter();
  const { addActivity } = useActivityLog();

  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(true);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;

    let unlisten: (() => void) | null = null;

    async function launchQemu() {
      try {
        await loadAssignment();
        const assignmentNum = await invoke<number>("get_assignment");

        //listen to qemu status
        unlisten = await listen<string>("qemu-status", async (event) => {
          if (event.payload === "started") {
            setLaunching(true);
            setError(null);
          } else if (event.payload === "stopped") {
            setLaunching(false);
            await addActivity(`Closed Assignment ${assignmentNum}`);
          } else if (event.payload === "error") {
            setLaunching(false);
            setError("QEMU process encountered an error");
          }
        });

        await invoke("launch_qemu");
      } catch (err: any) {
        setError(err?.message ?? String(err));
        await addActivity(`Error launching QEMU: ${err?.message ?? err}`);
        setLaunching(false);
      }
    }

    launchQemu();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return { launching, error, currentAssignment };
}
