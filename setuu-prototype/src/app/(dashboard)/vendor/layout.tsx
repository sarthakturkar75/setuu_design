"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { VendorSidebar } from "@/components/navigation/roles/VendorSidebar";
import { VendorTopbar } from "@/components/navigation/roles/VendorTopbar";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <VendorSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <VendorTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
