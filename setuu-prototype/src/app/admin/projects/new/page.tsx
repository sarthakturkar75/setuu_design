"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { WizardStepper } from "@/components/ui/WizardStepper";
import { FormField } from "@/components/ui/FormField";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { TextInput } from "@/components/ui/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProjectWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    poRef: "",
    contractValue: "",
    startDate: "",
    targetDate: "",
    pm: "",
    clientOrg: "",
    discipline: "",
    modules: {
      materials: true,
      drawings: true,
      issues: true,
      changes: false,
      resources: false
    }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleCreate = () => {
    // Navigate back to projects list or specific project ID in real app
    router.push("/admin/projects");
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="New Project Provisioning" 
        subtitle="Initialize a new project and configure its tracking modules"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/projects" className="hover:text-primary transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">New Project</span>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <WizardStepper 
            steps={[
              { label: "Project Master Data" },
              { label: "Assignments" },
              { label: "Configuration" },
              { label: "Review & Create" }
            ]} 
            currentStep={currentStep} 
          />
        </div>

        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <h3 className="font-merriweather text-xl font-bold text-on-surface mb-2">Project Master Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Project Name *">
                  <TextInput value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Alpha Tower" />
                </FormField>
                <FormField label="Project Type *">
                  <SelectMenu 
                    value={formData.type}
                    onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                    options={[
                      { label: "Select Type...", value: "" },
                      { label: "Commercial", value: "commercial" },
                      { label: "Residential", value: "residential" },
                      { label: "Infrastructure", value: "infra" },
                    ]}
                  />
                </FormField>
                <FormField label="PO Reference">
                  <TextInput value={formData.poRef} onChange={(e: any) => setFormData({...formData, poRef: e.target.value})} placeholder="e.g. PO-2026-0042" />
                </FormField>
                <FormField label="Contract Value (₹)">
                  <TextInput value={formData.contractValue} onChange={(e: any) => setFormData({...formData, contractValue: e.target.value})} placeholder="0.00" type="number" />
                </FormField>
                <FormField label="Start Date *">
                  <TextInput value={formData.startDate} onChange={(e: any) => setFormData({...formData, startDate: e.target.value})} type="date" />
                </FormField>
                <FormField label="Target Completion Date *">
                  <TextInput value={formData.targetDate} onChange={(e: any) => setFormData({...formData, targetDate: e.target.value})} type="date" />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Description">
                    <textarea 
                      className="w-full px-3 py-2 bg-surface text-on-surface border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                      value={formData.description}
                      onChange={(e: any) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief overview of the project scope..."
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <h3 className="font-merriweather text-xl font-bold text-on-surface mb-2">Stakeholder Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Client Organization *">
                  <SelectMenu 
                    value={formData.clientOrg}
                    onChange={(e: any) => setFormData({...formData, clientOrg: e.target.value})}
                    options={[
                      { label: "Select Client...", value: "" },
                      { label: "Acme Corp", value: "acme" },
                      { label: "Stark Industries", value: "stark" },
                    ]}
                  />
                </FormField>
                <FormField label="Primary Discipline *">
                  <SelectMenu 
                    value={formData.discipline}
                    onChange={(e: any) => setFormData({...formData, discipline: e.target.value})}
                    options={[
                      { label: "Select Discipline...", value: "" },
                      { label: "Architecture", value: "arch" },
                      { label: "Civil & Structural", value: "civil" },
                      { label: "MEP", value: "mep" },
                    ]}
                  />
                </FormField>
                <FormField label="Assigned Project Manager *">
                  <SelectMenu 
                    value={formData.pm}
                    onChange={(e: any) => setFormData({...formData, pm: e.target.value})}
                    options={[
                      { label: "Select PM...", value: "" },
                      { label: "Alice Chen", value: "alice" },
                      { label: "Bob Smith", value: "bob" },
                    ]}
                  />
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <h3 className="font-merriweather text-xl font-bold text-on-surface mb-2">Module Configuration</h3>
              <p className="text-sm text-on-surface-variant mb-6">Enable or disable specific tracking modules for this project. This can be changed later in Project Settings.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Material Tracking</h4>
                    <p className="text-sm text-on-surface-variant">Track POs, deliveries, and field receipts</p>
                  </div>
                  <ToggleSwitch checked={formData.modules.materials} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, materials: c}})} />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Drawing Hub</h4>
                    <p className="text-sm text-on-surface-variant">Manage architectural and engineering blueprints</p>
                  </div>
                  <ToggleSwitch checked={formData.modules.drawings} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, drawings: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Issues Logger</h4>
                    <p className="text-sm text-on-surface-variant">Log defects, snags, and site blockers</p>
                  </div>
                  <ToggleSwitch checked={formData.modules.issues} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, issues: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Change Requests</h4>
                    <p className="text-sm text-on-surface-variant">Manage scope variations and financial approvals</p>
                  </div>
                  <ToggleSwitch checked={formData.modules.changes} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, changes: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Resource Tracking</h4>
                    <p className="text-sm text-on-surface-variant">Timesheets and workforce allocation metrics</p>
                  </div>
                  <ToggleSwitch checked={formData.modules.resources} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, resources: c}})} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <h3 className="font-merriweather text-xl font-bold text-on-surface mb-2">Review & Finalize</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-variant/30 p-6 rounded-lg border border-outline-variant/30">
                <div>
                  <h4 className="text-xs font-bold font-jetbrains text-on-surface-variant uppercase tracking-wider mb-4">Project Details</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Name</dt><dd className="col-span-2 font-semibold text-on-surface">{formData.name || "—"}</dd></div>
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Type</dt><dd className="col-span-2 text-on-surface">{formData.type || "—"}</dd></div>
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Contract</dt><dd className="col-span-2 font-jetbrains text-on-surface">₹ {formData.contractValue || "0"}</dd></div>
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Start Date</dt><dd className="col-span-2 font-jetbrains text-on-surface">{formData.startDate || "—"}</dd></div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-xs font-bold font-jetbrains text-on-surface-variant uppercase tracking-wider mb-4">Assignments</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Client</dt><dd className="col-span-2 font-semibold text-on-surface">{formData.clientOrg || "—"}</dd></div>
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">PM</dt><dd className="col-span-2 text-on-surface">{formData.pm || "—"}</dd></div>
                    <div className="grid grid-cols-3"><dt className="text-on-surface-variant">Discipline</dt><dd className="col-span-2 text-on-surface">{formData.discipline || "—"}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-outline-variant">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="px-6 py-2 border border-outline-variant text-on-surface rounded-lg font-semibold hover:bg-surface-variant disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              Back
            </button>
            <div className="flex gap-3">
              {currentStep === totalSteps ? (
                <>
                  <button className="px-6 py-2 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                    Save Draft
                  </button>
                  <button onClick={handleCreate} className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Create Project
                  </button>
                </>
              ) : (
                <button 
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
