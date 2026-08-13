"use client";
import * as React from "react";

export default function EngineerTimesheetPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/30 shadow-sm text-center">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
          <span className="material-symbols-outlined text-3xl">construction</span>
        </div>
        <h1 className="font-merriweather text-3xl font-bold text-primary mb-4">Timesheet</h1>
        <p className="text-on-surface-variant font-inter max-w-md mx-auto">
          This is a placeholder for the engineer timesheet module. Development is scheduled for an upcoming phase.
        </p>
      </div>
    </div>
  );
}
