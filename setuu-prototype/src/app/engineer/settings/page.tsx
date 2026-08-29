"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast, toast } from "@/components/ui/Toast";

export default function EngineerSettings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Preferences saved successfully");
    }, 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Settings" subtitle="Manage your profile and notification preferences." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <h3 className="font-bold text-lg text-on-surface">Notification Protocols</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-on-surface">Task Assignments</h4>
                <p className="text-sm text-on-surface-variant">When you are assigned a new task.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-on-surface">Peer Reviews</h4>
                <p className="text-sm text-on-surface-variant">When you receive a review request.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-on-surface">@Mentions</h4>
                <p className="text-sm text-on-surface-variant">When someone mentions you in collaboration.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h3 className="font-bold text-lg text-on-surface">Theme & Display</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Color Theme</label>
              <select className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface">
                <option value="system">System Default</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Default Project</label>
              <select className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface">
                <option>None (Show Dashboard)</option>
                <option>Alpha Tower</option>
                <option>Beta Bridge</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Preferences"}</Button>
      </div>
    </div>
  );
}
