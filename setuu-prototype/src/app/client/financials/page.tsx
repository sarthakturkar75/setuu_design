"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function ClientFinancials() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Financials & Change Requests" subtitle="Review change requests and cost impacts." />
      <Card className="p-6 text-slate-400">Financials board coming soon.</Card>
    </div>
  );
}
