import { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; 

export function useAssignmentCounter() {
  //state to hold current assignment counter on React side
  const [currentAssignment, setCurrentAssignment] = useState<number | null>(null);

  //function to load current assignment counter from Rust backend
  async function loadAssignment() {
    try {
      const value = await invoke<number>("get_assignment");
      setCurrentAssignment(value);
    } catch (e) {
      console.error("Failed to load assignment:", e);
    }
  }

  //function to increment assignment counter from Rust backend
  async function incrementAssignment() {
    try {
      const value = await invoke<number>("increment_assignment");
      setCurrentAssignment(value);
    } catch (e) {
      console.error("Failed to increment assignment:", e);
    }
  }

  return {currentAssignment, loadAssignment, incrementAssignment};
}