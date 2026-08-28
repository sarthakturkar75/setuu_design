"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function EngineerSettings() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="Manage your profile and notification preferences." />
      <Card className="p-6 text-slate-400">Settings panel coming soon.</Card>
    </div>
  );
}
