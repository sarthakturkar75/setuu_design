"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function ClientDrawings() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Drawing Hub" subtitle="Read-only drawing viewer." />
      <Card className="p-6 text-slate-400">Viewer coming soon.</Card>
    </div>
  );
}
