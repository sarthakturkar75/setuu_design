"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function ClientProgress() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Verified Progress Feed" subtitle="Timeline of site updates." />
      <Card className="p-6 text-slate-400">Progress feed coming soon.</Card>
    </div>
  );
}
