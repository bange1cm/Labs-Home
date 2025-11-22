import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function InitializationGuard() {
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkInitialization();
  }, []);

  const checkInitialization = async () => {
    try {
      const firstRun = await invoke<boolean>("is_first_run");
      setIsFirstRun(firstRun);
    } catch (err) {
      console.error("Error checking initialization:", err);
      setIsFirstRun(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (isFirstRun) {
    return <Navigate to="/initialize" replace />;
  }

  return <Outlet />;
}

export default InitializationGuard;
