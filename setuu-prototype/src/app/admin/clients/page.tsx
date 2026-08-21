"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { CheckCircle, Users } from "lucide-react";

export default function ClientsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Client Relations" subtitle="Manage client approvals, meetings, and communications." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/clients/approvals">
          <Card title="Pending Approvals" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <CheckCircle className="w-8 h-8 text-primary" />
              <p className="text-sm text-on-surface-variant">Track and expedite client sign-offs and milestones.</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/clients/meetings">
          <Card title="Client Meetings" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <Users className="w-8 h-8 text-semantic-blue" />
              <p className="text-sm text-on-surface-variant">Schedule and log formal client engagements.</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}