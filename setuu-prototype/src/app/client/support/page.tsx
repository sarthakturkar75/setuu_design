"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextArea } from "@/components/ui/TextArea";
import { Toast, toast } from "@/components/ui/Toast";
import { LifeBuoyIcon, MessageCircleIcon, BookIcon } from "lucide-react";

export default function ClientSupport() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    import("@/app/actions/supportActions").then(({ createTicket }) => {
      return createTicket({ title: "Client Message", description: "A message from client", priority: "medium" });
    }).then(() => {
      toast.success("Message sent to your Project Manager");
    }).catch(err => toast.error("Failed to send message")).finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Client Support" subtitle="We're here to help. Reach out to your project team or browse the knowledge base." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
              <MessageCircleIcon className="text-primary w-6 h-6" />
              <h3 className="text-xl font-bold text-on-surface">Contact Project Manager</h3>
            </div>
            
            <div className="space-y-4 max-w-lg">
              <FormField label="Subject"><input name="subject" placeholder="What is this regarding?" className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface" /></FormField>
              <div className="mb-1 text-sm font-medium text-on-surface-variant">Message</div><TextArea placeholder="How can we help you today?" rows={6} />
              <div className="pt-2">
                <Button onClick={handleSubmit} disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary text-on-primary border-none">
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <LifeBuoyIcon className="w-12 h-12 opacity-80" />
              <div>
                <h3 className="font-bold text-lg mb-2">Emergency Contact</h3>
                <p className="text-sm opacity-90">For critical site issues requiring immediate attention.</p>
              </div>
              <div className="text-2xl font-mono font-bold">1-800-SETUU-PM</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookIcon className="text-on-surface-variant w-5 h-5" />
              <h3 className="font-bold text-on-surface">FAQ & Guides</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li><a href="/client/approvals" className="text-primary hover:underline">How to approve a change request</a></li>
              <li><a href="/client/progress" className="text-primary hover:underline">Understanding the progress timeline</a></li>
              <li><a href="/client/meetings" className="text-primary hover:underline">Downloading meeting minutes</a></li>
              <li><a href="/client/notifications" className="text-primary hover:underline">Notification settings</a></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
