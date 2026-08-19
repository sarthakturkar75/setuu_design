"use client";

import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { PMProvider } from "@/contexts/PMContext";
import { OfflineSyncProvider } from "@/contexts/OfflineSyncContext";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  return (
    <OfflineSyncProvider>
      <PMProvider>
        <DashboardShell>
          {children}
        </DashboardShell>
      </PMProvider>
    </OfflineSyncProvider>
  );
}