"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Toggle } from "@/components/ui/Toggle";
import { ShieldCheck, Send, X, Mail } from "lucide-react";

export default function InviteOrgAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orgName: "",
    tier: "professional",
    storage: "500",
    projects: "10",
    allowMfaBypass: false,
    requireSso: true,
    allowApiAccess: true
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Provision Organization Admin" 
        subtitle="Invite a new tenant administrator and configure their organizational boundary."
      />

      <div className="flex items-center gap-3 p-4 bg-semantic-emerald-bg/10 border border-semantic-emerald/30 rounded-lg">
        <ShieldCheck className="w-6 h-6 text-semantic-emerald" />
        <div>
          <h4 className="font-semibold text-semantic-emerald">Security Protocol Active</h4>
          <p className="text-sm text-on-surface-variant">Invitations are sent via secure link expiring in 24 hours. The new admin must verify their identity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card title="Identity Details">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Organization Name</label>
                <TextInput 
                  placeholder="e.g. Acme Corp" 
                  value={formData.orgName}
                  onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Admin Full Name</label>
                <TextInput 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Admin Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 bg-surface-container border border-outline-variant rounded-md text-sm placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    placeholder="admin@acmecorp.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Permissions & Guardrails">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-on-surface">Enforce SAML SSO</span>
                <Toggle 
                  checked={formData.requireSso} 
                  onChange={(v) => setFormData({...formData, requireSso: v})} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-on-surface">Allow API Access</span>
                <Toggle 
                  checked={formData.allowApiAccess} 
                  onChange={(v) => setFormData({...formData, allowApiAccess: v})} 
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-on-surface">Allow MFA Bypass (Not Recommended)</span>
                <Toggle 
                  checked={formData.allowMfaBypass} 
                  onChange={(v) => setFormData({...formData, allowMfaBypass: v})} 
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Subscription & Quota">
            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface">Plan Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['starter', 'professional', 'enterprise'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFormData({...formData, tier})}
                      className={`py-2 px-3 text-sm font-medium rounded border capitalize transition-colors ${
                        formData.tier === tier 
                          ? 'bg-primary text-on-primary border-primary' 
                          : 'bg-surface-container text-on-surface border-outline-variant hover:border-primary/50'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface flex justify-between">
                  <span>Storage Quota (GB)</span>
                  <span className="font-jetbrains-mono text-on-surface-variant">{formData.storage} GB</span>
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100" 
                  value={formData.storage}
                  onChange={(e) => setFormData({...formData, storage: e.target.value})}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>100 GB</span>
                  <span>5 TB</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface flex justify-between">
                  <span>Max Active Projects</span>
                  <span className="font-jetbrains-mono text-on-surface-variant">{formData.projects}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={formData.projects}
                  onChange={(e) => setFormData({...formData, projects: e.target.value})}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 justify-end pt-4">
            <button className="px-6 py-2 border border-outline-variant text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Formal Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
