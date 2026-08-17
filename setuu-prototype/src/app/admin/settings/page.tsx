"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { Save, Building2, Shield, Bell, Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Admin Settings" 
        subtitle="Configure global workspace preferences and security policies"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Settings</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Settings Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('organization')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'organization' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'
                }`}
              >
                <Building2 className="w-5 h-5" />
                Organization Profile
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'
                }`}
              >
                <Shield className="w-5 h-5" />
                Security & Access
              </button>
              <button 
                onClick={() => setActiveTab('localization')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'localization' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'
                }`}
              >
                <Globe className="w-5 h-5" />
                Localization
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'
                }`}
              >
                <Bell className="w-5 h-5" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'organization' && (
              <Card className="p-6">
                <h3 className="font-merriweather font-bold text-xl text-on-surface mb-6">Organization Profile</h3>
                <div className="space-y-6 max-w-2xl">
                  <FormField label="Organization Name">
                    <TextInput value="SETUU Enterprise" />
                  </FormField>
                  <FormField label="Primary Contact Email">
                    <TextInput value="admin@setuu.com" />
                  </FormField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Tax ID / GSTIN">
                      <TextInput value="27AADCB2230M1Z2" />
                    </FormField>
                    <FormField label="Registration Number">
                      <TextInput value="CIN-U72900MH2026PTC" />
                    </FormField>
                  </div>
                  <FormField label="Headquarters Address">
                    <textarea 
                      className="w-full px-3 py-2 bg-surface text-on-surface border border-outline rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                      value="101 Alpha Tower, Cyber City, Mumbai 400001"
                      readOnly
                    />
                  </FormField>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="p-6">
                <h3 className="font-merriweather font-bold text-xl text-on-surface mb-6">Security & Access Policies</h3>
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-on-surface-variant">Require 2FA for all administrative accounts.</p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">Session Timeout</h4>
                      <p className="text-sm text-on-surface-variant">Automatically log out inactive users after 30 minutes.</p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">IP Whitelisting</h4>
                      <p className="text-sm text-on-surface-variant">Restrict Superadmin access to corporate network IPs.</p>
                    </div>
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'localization' && (
              <Card className="p-6">
                <h3 className="font-merriweather font-bold text-xl text-on-surface mb-6">Localization Preferences</h3>
                <div className="space-y-6 max-w-2xl">
                  <FormField label="Default Currency">
                    <SelectMenu 
                      options={[
                        { label: "INR (₹) - Indian Rupee", value: "inr" },
                        { label: "USD ($) - US Dollar", value: "usd" },
                        { label: "EUR (€) - Euro", value: "eur" },
                      ]}
                      value="inr"
                      onChange={() => {}}
                    />
                  </FormField>
                  <FormField label="Timezone">
                    <SelectMenu 
                      options={[
                        { label: "(GMT+05:30) India Standard Time", value: "ist" },
                        { label: "(GMT+00:00) UTC", value: "utc" },
                      ]}
                      value="ist"
                      onChange={() => {}}
                    />
                  </FormField>
                  <FormField label="Date Format">
                    <SelectMenu 
                      options={[
                        { label: "DD/MM/YYYY", value: "dmy" },
                        { label: "MM/DD/YYYY", value: "mdy" },
                        { label: "YYYY-MM-DD", value: "ymd" },
                      ]}
                      value="dmy"
                      onChange={() => {}}
                    />
                  </FormField>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h3 className="font-merriweather font-bold text-xl text-on-surface mb-6">System Notifications</h3>
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">Project Milestone Alerts</h4>
                      <p className="text-sm text-on-surface-variant">Notify admins when critical milestones are delayed.</p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">Budget Overrun Warnings</h4>
                      <p className="text-sm text-on-surface-variant">Trigger alerts when project spend exceeds 90% of budget.</p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg">
                    <div>
                      <h4 className="font-semibold text-on-surface">Weekly Summary Reports</h4>
                      <p className="text-sm text-on-surface-variant">Send automated portfolio health summaries via email.</p>
                    </div>
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </div>
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
