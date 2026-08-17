"use client";

import { DashboardShell } from "@/components/navigation/DashboardShell";
import { SuperadminSidebar } from "@/components/navigation/SuperadminSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { Topbar } from "@/components/navigation/Topbar";
import * as React from "react";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      sidebar={(props) => <SuperadminSidebar />}
      bottomNav={(props) => <MobileBottomNav onMenuClick={props.onMenuClick} />}
      topbar={(props) => (
        <Topbar
          title="Control Center"
          isAdmin={true}
          onMenuClick={props.onMenuClick}
        />
      )}
    >
      {children}
    </DashboardShell>
  );
}
