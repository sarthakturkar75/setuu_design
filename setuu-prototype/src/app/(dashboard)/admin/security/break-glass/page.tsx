"use client";

import { useState } from "react";
import { AlertTriangleIcon, ShieldAlertIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function BreakGlassPage() {
  const [phrase, setPhrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const REQUIRED_PHRASE = "I AUTHORIZE EMERGENCY ELEVATION";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase !== REQUIRED_PHRASE) return;

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="p-6 max-w-3xl mx-auto mt-20">
        <div className="bg-semantic-emerald/10 border border-semantic-emerald/30 p-8 rounded-xl text-center space-y-4">
          <ShieldAlertIcon className="w-16 h-16 text-semantic-emerald mx-auto" />
          <h2 className="text-2xl font-bold text-semantic-emerald font-inter">Elevation Granted</h2>
          <p className="text-on-surface-variant font-inter">
            You have been granted temporary SuperAdmin privileges for the next 60 minutes.
            All actions during this session will be rigorously audited and flagged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto w-full pt-12 pb-20">
      <Card className="border-semantic-crimson/50 shadow-lg shadow-semantic-crimson/5">
        <CardHeader className="bg-semantic-crimson/10 border-b border-semantic-crimson/20 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangleIcon className="w-8 h-8 text-semantic-crimson" />
            <CardTitle className="text-2xl text-semantic-crimson">Break-Glass Emergency Protocol</CardTitle>
          </div>
          <CardDescription className="text-on-surface-variant text-base">
            This protocol bypasses standard role restrictions. It is strictly reserved for critical outages,
            security breaches, or imminent project failure when standard escalation is impossible.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="bg-surface-container p-4 rounded-lg border border-outline-variant">
            <h4 className="font-semibold text-on-surface mb-2">Warning:</h4>
            <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-1">
              <li>This action will immediately notify the executive board via SMS and Email.</li>
              <li>Your session will be restricted to 60 minutes.</li>
              <li>Every click and query will be logged to the immutable audit ledger.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-on-surface">
                Incident Reason (Required)
              </label>
              <textarea
                id="reason"
                required
                rows={3}
                className="w-full bg-surface rounded-md border border-outline-variant p-3 text-on-surface focus:border-semantic-crimson focus:ring-1 focus:ring-semantic-crimson resize-none"
                placeholder="Briefly describe the emergency..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phrase" className="block text-sm font-medium text-on-surface">
                To proceed, type the following phrase: <span className="font-jetbrains-mono font-bold text-semantic-crimson">{REQUIRED_PHRASE}</span>
              </label>
              <input
                id="phrase"
                type="text"
                required
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className="w-full bg-surface rounded-md border border-outline-variant p-3 text-on-surface focus:border-semantic-crimson focus:ring-1 focus:ring-semantic-crimson font-jetbrains-mono"
                placeholder="Type the exact phrase here"
                autoComplete="off"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={phrase !== REQUIRED_PHRASE || isSubmitting}
                className="bg-semantic-crimson text-white px-6 py-2.5 rounded-md font-medium disabled:opacity-50 transition-colors hover:bg-semantic-crimson/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {isSubmitting ? "Authenticating..." : "Initiate Break-Glass"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
