import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

//defines data structure for activity log
export interface Activity {
  timestamp: string;
  description: string;
}

export function useActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]); 
  const [loading, setLoading] = useState(false); 

  const loadActivities = async () => {
    setLoading(true);
    try {
      const result = await invoke<Record<string, string>>("load_log");
      const list = Object.entries(result).map(([timestamp, description]) => ({
        timestamp,
        description: description as string,
      }));
      setActivities(list);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (description: string) => {
    setLoading(true);
    try {
      const updated = await invoke<Record<string, string>>("add_activity", { description });
      const list = Object.entries(updated).map(([timestamp, description]) => ({
        timestamp,
        description: description as string,
      }));
      setActivities(list);
    } finally {
      setLoading(false);
    }
  };

  return { activities, loading, loadActivities, addActivity };
}
