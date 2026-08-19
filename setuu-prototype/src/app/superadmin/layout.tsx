"use client";

import { DashboardShell } from "@/components/navigation/DashboardShell";
import * as React from "react";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}