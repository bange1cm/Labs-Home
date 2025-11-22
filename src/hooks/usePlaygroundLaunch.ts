import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export function usePlaygroundLaunch() {
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(true);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;

    let unlisten: (() => void) | null = null;

    async function launchPlayground() {
      try {
        //listen to qemu status
        unlisten = await listen<string>("qemu-status", async (event) => {
          if (event.payload === "started") {
            setLaunching(true);
            setError(null);
          } else if (event.payload === "stopped") {
            setLaunching(false);
          } else if (event.payload === "error") {
            setLaunching(false);
            setError("QEMU process encountered an error");
          }
        });

        await invoke("launch_playground");
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setLaunching(false);
      }
    }

    launchPlayground();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return { launching, error };
}
