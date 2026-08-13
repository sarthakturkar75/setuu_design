"use client";

import * as React from "react";
import { useState } from "react";
import { createClientOrg } from "@/app/actions/clientActions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { SaveIcon } from "lucide-react";

export function ClientOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createClientOrg(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Client Onboarding Wizard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-semantic-crimson-bg text-semantic-crimson-on text-sm rounded-md border border-semantic-crimson-bg/50">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-on-surface">Organization Name *</label>
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-on-surface">Description / Details</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Primary client contact details, industry, etc."
              className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-outline-variant pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:opacity-50"
          >
            <SaveIcon className="w-4 h-4" />
            {loading ? "Creating..." : "Provision Client Organization"}
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
