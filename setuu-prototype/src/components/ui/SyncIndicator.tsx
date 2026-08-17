import React from 'react';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'syncing' | 'synced' | 'error';

interface SyncIndicatorProps {
  status: SyncStatus;
  lastSyncedAt?: string;
  className?: string;
}

export function SyncIndicator({ status, lastSyncedAt, className }: SyncIndicatorProps) {
  return (
    <div className={cn("flex items-center space-x-2 text-xs font-inter", className)}>
      {status === 'syncing' && (
        <RefreshCw className="w-3.5 h-3.5 text-primary animate-sync-spin" />
      )}
      {status === 'synced' && (
        <CheckCircle2 className="w-3.5 h-3.5 text-semantic-emerald" />
      )}
      {status === 'error' && (
        <XCircle className="w-3.5 h-3.5 text-error" />
      )}
      <span className={cn(
        "font-medium",
        status === 'syncing' && "text-primary",
        status === 'synced' && "text-on-surface-variant",
        status === 'error' && "text-error"
      )}>
        {status === 'syncing' && "Syncing..."}
        {status === 'synced' && lastSyncedAt && `Last synced ${lastSyncedAt}`}
        {status === 'synced' && !lastSyncedAt && "Synced"}
        {status === 'error' && "Sync failed"}
      </span>
    </div>
  );
}
