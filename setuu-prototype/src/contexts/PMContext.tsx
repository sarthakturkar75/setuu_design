"use client";

import React, { createContext, useContext, useState } from "react";

interface PMContextType {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
}

const PMContext = createContext<PMContextType>({
  activeProjectId: null,
  setActiveProjectId: () => {},
});

export function PMProvider({ children }: { children: React.ReactNode }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <PMContext.Provider value={{ activeProjectId, setActiveProjectId }}>
      {children}
    </PMContext.Provider>
  );
}

export const usePMContext = () => useContext(PMContext);
