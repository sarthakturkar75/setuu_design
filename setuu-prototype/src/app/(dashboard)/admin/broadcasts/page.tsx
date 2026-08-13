"use client";

import { useState } from "react";
import { SendIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function BroadcastsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    setIsSubmitting(true);
    // In a real app we'd trigger a server action here to insert into notifications table
    await new Promise((r) => setTimeout(r, 1200));
    
    setSuccess(true);
    setIsSubmitting(false);
    setTitle("");
    setMessage("");
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 w-full pb-20 pt-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Bulk Notification Center</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Compose and dispatch urgent system-wide or role-specific broadcast alerts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <CardTitle>Broadcast Composer</CardTitle>
          </div>
          <CardDescription>Messages appear instantly via the WebSocket push notification channel.</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-semantic-emerald/10 border border-semantic-emerald/30 rounded-md text-semantic-emerald font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Broadcast dispatched successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface">Target Audience</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">Everyone (All Active Users)</option>
                <option value="project_managers">Project Managers Only</option>
                <option value="vendors">Vendors & Subcontractors Only</option>
                <option value="clients">Clients Only</option>
                <option value="engineers">Engineers & Field Staff Only</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface">Broadcast Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled Maintenance Downtime"
                className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary font-semibold"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface">Message Body</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the full alert details here..."
                rows={5}
                className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={!title || !message || isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {isSubmitting ? "Dispatching..." : (
                  <>
                    <SendIcon className="w-4 h-4" />
                    Dispatch Broadcast
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
