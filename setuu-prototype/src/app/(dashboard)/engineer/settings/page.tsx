"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Settings, 
  GitBranch, 
  Database, 
  Code2, 
  Save, 
  CheckCircle2, 
  Bell, 
  Terminal,
  FileBox
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-merriweather text-2xl font-bold text-on-surface">Employee Preferences</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage tool integrations and workflow environments.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaved ? "Saved" : "Save Preferences"}
        </button>
      </div>

      <div className="flex space-x-8">
        {/* Left: Tab Navigation */}
        <div className="w-64 space-y-2 shrink-0">
          <button 
            onClick={() => setActiveTab("integrations")}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "integrations" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Database className="w-5 h-5 mr-3" />
            Tool Integrations
          </button>
          <button 
            onClick={() => setActiveTab("environment")}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "environment" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Terminal className="w-5 h-5 mr-3" />
            Build Environment
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "notifications" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            Notifications
          </button>
        </div>

        {/* Right: Tab Content */}
        <div className="flex-1 space-y-6">
          
          {activeTab === "integrations" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" /> GitHub Binding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-on-surface-variant">Bind your GitHub account to link commits automatically to your tasks.</p>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Personal Access Token (Classic)</label>
                    <input 
                      type="password" 
                      defaultValue="ghp_xxxxxxxxxxxxxxxxxxxx" 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-sm font-jetbrains-mono focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code2 className="w-5 h-5 mr-2" /> Jira Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-on-surface-variant">Sync Issue status across Praimo and Jira.</p>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Jira API Token</label>
                    <input 
                      type="password" 
                      placeholder="Enter token..."
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-sm font-jetbrains-mono focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileBox className="w-5 h-5 mr-2" /> Altium / PLM Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-on-surface-variant">Connect to the central schematic and layout vault.</p>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Vault Access Key</label>
                    <input 
                      type="password" 
                      placeholder="Enter key..."
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-sm font-jetbrains-mono focus:ring-2 focus:ring-primary/50 outline-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "environment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="w-5 h-5 mr-2" /> Target Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Default Build Target</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                    <option>DevKit-Alpha-04 (Local STM32)</option>
                    <option>HIL-Testing-Rig (Remote)</option>
                    <option>Production Simulation (AWS)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Compiler Flags (C/C++)</label>
                  <input 
                    type="text" 
                    defaultValue="-O3 -Wall -Wextra --std=gnu11"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-sm font-jetbrains-mono focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" /> Notification Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/30">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary/50" />
                  <span className="text-sm font-medium text-on-surface">Notify on @mentions</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/30">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary/50" />
                  <span className="text-sm font-medium text-on-surface">Notify when assigned a new Task or Review</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/30">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary/50" />
                  <span className="text-sm font-medium text-on-surface">Notify on standard CI/CD pipeline completion</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/30">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary/50" />
                  <span className="text-sm font-medium text-on-surface flex items-center">
                    Notify on 
                    <span className="mx-1 px-1.5 py-0.5 bg-semantic-crimson/10 text-semantic-crimson text-xs rounded border border-semantic-crimson/20">Critical</span> 
                    CI/CD failures
                  </span>
                </label>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
