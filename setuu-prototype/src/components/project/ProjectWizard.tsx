"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { createProject } from "@/app/actions/projectActions";
import { CheckIcon, ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

type Option = { id: string; name: string };

interface ProjectWizardProps {
  clients: Option[];
  pms: Option[];
}

export function ProjectWizard({ clients, pms }: ProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Core Details", "Assign Roles", "Budget & Timeline"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createProject(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
      // If success, it redirects, so we don't need to unset loading immediately
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-outline-variant z-0" />
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isPast = step > stepNumber;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm font-jetbrains-mono border-2 transition-colors ${
                  isActive
                    ? "bg-primary border-primary text-on-primary shadow-sm"
                    : isPast
                    ? "bg-semantic-emerald-bg border-semantic-emerald-bg text-semantic-emerald-on"
                    : "bg-surface-container border-outline-variant text-on-surface-variant"
                }`}
              >
                {isPast ? <CheckIcon className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`mt-2 text-xs font-medium font-inter ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <Card className="w-full overflow-visible">
          <CardHeader>
            <CardTitle>{steps[step - 1]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-semantic-crimson-bg text-semantic-crimson-on text-sm rounded-md border border-semantic-crimson-bg/50">
                {error}
              </div>
            )}
            
            <div className={step === 1 ? "space-y-4" : "hidden"}>
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-on-surface">Project Name *</label>
                <input
                  required={step === 1}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Setuu Phase 1"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="description" className="text-sm font-medium text-on-surface">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="type" className="text-sm font-medium text-on-surface">Project Type</label>
                <select
                  id="type"
                  name="type"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Software">Software</option>
                  <option value="Combined">Combined</option>
                </select>
              </div>
            </div>

            <div className={step === 2 ? "space-y-4" : "hidden"}>
              <div className="space-y-1">
                <label htmlFor="client_org_id" className="text-sm font-medium text-on-surface">Client Organization</label>
                <select
                  id="client_org_id"
                  name="client_org_id"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="assigned_pm_id" className="text-sm font-medium text-on-surface">Assign Project Manager</label>
                <select
                  id="assigned_pm_id"
                  name="assigned_pm_id"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select PM</option>
                  {pms.map(pm => (
                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={step === 3 ? "space-y-4" : "hidden"}>
              <div className="space-y-1">
                <label htmlFor="po_reference" className="text-sm font-medium text-on-surface">PO Reference (optional)</label>
                <input
                  id="po_reference"
                  name="po_reference"
                  type="text"
                  placeholder="e.g. PO-2026-908"
                  className="w-full font-jetbrains-mono uppercase rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="contract_value" className="text-sm font-medium text-on-surface">Contract Value ($)</label>
                <input
                  id="contract_value"
                  name="contract_value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm font-jetbrains-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="target_date" className="text-sm font-medium text-on-surface">Target Delivery Date</label>
                <input
                  id="target_date"
                  name="target_date"
                  type="date"
                  className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm font-jetbrains-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-outline-variant pt-4">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1 || loading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-md font-medium text-sm transition-colors hover:bg-surface-container focus-visible:outline-none disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:opacity-50"
            >
              {loading ? "Processing..." : step === 3 ? "Create Project" : "Next"}
              {!loading && step < 3 && <ChevronRightIcon className="w-4 h-4" />}
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
