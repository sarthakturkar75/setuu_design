"use client";

import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import { CloudOffIcon, CloudUploadIcon } from 'lucide-react';
import { createUpdate } from '@/app/actions/updateActions';
import { useToast } from '@/contexts/ToastContext';

export default function OfflineSyncManager() {
  const toast = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);
    
    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        // console.log('SW registered');
      }).catch(err => console.error('SW error', err));
    }

    const checkQueue = async () => {
      const keys = await localforage.keys();
      const offlineUpdates = keys.filter(k => k.startsWith('offline-update-'));
      setPendingCount(offlineUpdates.length);
    };

    checkQueue();

    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to SW messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'PROCESS_SYNC_QUEUE') {
          processQueue();
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const processQueue = async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);

    try {
      const keys = await localforage.keys();
      const offlineKeys = keys.filter(k => k.startsWith('offline-update-'));
      
      if (offlineKeys.length === 0) {
        setIsSyncing(false);
        return;
      }

      

      let successCount = 0;
      for (const key of offlineKeys) {
        try {
          const item: any = await localforage.getItem(key);
          if (item) {
            // Reconstruct FormData
            const formData = new FormData();
            formData.append('project_id', item.projectId);
            formData.append('author_id', item.authorId);
            formData.append('caption', item.caption);
            if (item.weatherData) formData.append('weather_data', JSON.stringify(item.weatherData));
            
            // Reconstruct file
            const res = await fetch(item.photoDataUrl);
            const blob = await res.blob();
            formData.append('files', new File([blob], `sync-${Date.now()}.jpg`, { type: blob.type }));
            
            const result = await createUpdate(formData);
            if (result.success) {
              await localforage.removeItem(key);
              successCount++;
            }
          }
        } catch (err) {
          console.error("Failed to sync item:", key, err);
        }
      }

      setPendingCount(prev => prev - successCount);
      if (successCount > 0) {
        
        toast.success(`Successfully synced ${successCount} updates.`);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline || pendingCount > 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-surface-container border border-outline-variant shadow-lg rounded-full px-4 py-2 flex items-center gap-3 z-50">
        {!isOnline ? (
          <div className="flex items-center gap-2 text-semantic-amber">
            <CloudOffIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Offline</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-semantic-emerald">
            <CloudUploadIcon className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span className="text-sm font-medium">Syncing...</span>
          </div>
        )}
        
        {pendingCount > 0 && (
          <div className="text-xs font-jetbrains-mono bg-semantic-indigo text-white px-2 py-0.5 rounded-full">
            {pendingCount} pending
          </div>
        )}
      </div>
    );
  }

  return null;
}
