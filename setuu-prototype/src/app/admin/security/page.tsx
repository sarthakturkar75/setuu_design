"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, FileWarning, Fingerprint } from "lucide-react";

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security & Compliance" subtitle="Centralized security monitoring and threat management." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/security/audit">
          <Card title="Audit Logs" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <Fingerprint className="w-8 h-8 text-primary" />
              <p className="text-sm text-on-surface-variant">Immutable trail of all administrative and system actions.</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/security/threats">
          <Card title="Active Threats" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <AlertTriangle className="w-8 h-8 text-semantic-crimson" />
              <p className="text-sm text-on-surface-variant">Real-time threat detection and mitigation center.</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/security/duplicates">
          <Card title="Duplicate Detection" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <FileWarning className="w-8 h-8 text-semantic-amber" />
              <p className="text-sm text-on-surface-variant">Manage and resolve file collisions and duplicates.</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/security/dropzone">
          <Card title="Secure Dropzone" className="hover:bg-surface-variant/20 transition-colors cursor-pointer">
            <div className="p-4 flex gap-4">
              <ShieldCheck className="w-8 h-8 text-semantic-emerald" />
              <p className="text-sm text-on-surface-variant">Upload and scan files securely using ClamAV isolation.</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}