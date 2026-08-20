"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

const DB_NAME = "setuu-sync-db";
const STORE_NAME = "sync-queue";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Not on client"));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllItems(): Promise<SyncItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch(e) {
    return [];
  }
}

async function saveItem(item: SyncItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);

  const loadQueue = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const items = await getAllItems();
      setSyncQueue(items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    } catch (e) {
      console.error("Failed to load sync queue from IndexedDB", e);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }
    loadQueue();

    const handleOnline = () => {
      setIsOnline(true);
      retryAll(); // Auto-sync when coming online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Register service worker if supported for background sync
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadQueue]);

  const processItem = async (item: SyncItem) => {
    try {
      await saveItem({ ...item, status: "syncing" });
      await loadQueue();

      // Mock network delay or dispatch
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      await deleteItem(item.id);
    } catch (error) {
      console.error("Sync failed for item:", item.id, error);
      await saveItem({ ...item, status: "failed" });
    } finally {
      await loadQueue();
    }
  };

  const retryItem = async (id: string) => {
    if (!isOnline) return;
    const item = syncQueue.find(i => i.id === id);
    if (item) {
      await processItem(item);
    } else {
      const items = await getAllItems();
      const dbItem = items.find(i => i.id === id);
      if (dbItem) await processItem(dbItem);
    }
  };

  const retryAll = async () => {
    if (!isOnline) return;
    const items = await getAllItems();
    const pending = items.filter(i => i.status !== "syncing");
    for (const item of pending) {
      await processItem(item);
    }
  };

  const addToQueue = async (type: string, payload: any) => {
    const newItem: SyncItem = {
      id: crypto.randomUUID(),
      type,
      payload,
      status: "queued",
      timestamp: new Date().toISOString()
    };
    
    await saveItem(newItem);
    await loadQueue();
    
    if (isOnline) {
      retryItem(newItem.id);
    }
  };

  return (
    <OfflineSyncContext.Provider value={{ isOnline, syncQueue, addToQueue, retryItem, retryAll }}>
      {children}
    </OfflineSyncContext.Provider>
  );
}

export const useOfflineSync = () => useContext(OfflineSyncContext);
