"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function ClientMeetings() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Meetings" subtitle="Client meetings and agendas." />
      <Card className="p-6 text-slate-400">Meetings hub coming soon.</Card>
    </div>
  );
}
