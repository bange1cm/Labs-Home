import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

//not actually a hook because it will be called via a button click not on render
export function resetPlayground() {
  const [reseted, setReseted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reset() {
    try {
      await invoke("reset_playground");
      setReseted(true);
    } catch (error) {
      setError(String(error));
    }
  }

  return { reseted, error, reset };
}
