"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SyncItem {
  id: string;
  type: string;
  payload: any;
  status: "queued" | "syncing" | "failed";
  timestamp: string;
}

interface OfflineSyncContextType {
  isOnline: boolean;
  syncQueue: SyncItem[];
  addToQueue: (type: string, payload: any) => void;
  retryItem: (id: string) => void;
  retryAll: () => void;
}

const OfflineSyncContext = createContext<OfflineSyncContextType>({
  isOnline: true,
  syncQueue: [],
  addToQueue: () => {},
  retryItem: () => {},
  retryAll: () => {},
});

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addToQueue = (type: string, payload: any) => {
    const newItem: SyncItem = {
      id: crypto.randomUUID(),
      type,
      payload,
      status: "queued",
      timestamp: new Date().toISOString()
    };
    setSyncQueue(prev => [...prev, newItem]);
  };

  const retryItem = (id: string) => {};
  const retryAll = () => {};

  return (
    <OfflineSyncContext.Provider value={{ isOnline, syncQueue, addToQueue, retryItem, retryAll }}>
      {children}
    </OfflineSyncContext.Provider>
  );
}

export const useOfflineSync = () => useContext(OfflineSyncContext);
