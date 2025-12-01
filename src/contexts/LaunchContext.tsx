import { createContext, useContext, ReactNode, useState } from "react";

interface LaunchContextType {
  launching: boolean;
  setLaunching: (launching: boolean) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export function LaunchProvider({ children }: { children: ReactNode }) {
  const [launching, setLaunching] = useState(false);

  return (
    <LaunchContext.Provider value={{ launching, setLaunching }}>
      {children}
    </LaunchContext.Provider>
  );
}

export function useLaunchContext() {
  const context = useContext(LaunchContext);
  if (context === undefined) {
    throw new Error("useLaunchContext must be used within a LaunchProvider");
  }
  return context;
}
