"use client";

import { DashboardShell } from "@/components/navigation/DashboardShell";
import { OfflineSyncProvider } from "@/contexts/OfflineSyncContext";
import * as React from "react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OfflineSyncProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </OfflineSyncProvider>
  );
}
