"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function EngineerTimesheet() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Timesheet Logger" subtitle="Log your hours across active projects." />
      <Card className="p-6">
        <p className="text-slate-400 mb-4">Select a week to log hours.</p>
        <Button>Submit Week</Button>
      </Card>
    </div>
  );
}
