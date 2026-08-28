"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { WizardStepper } from "@/components/ui/WizardStepper";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { TextInput } from "@/components/ui/TextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/actions/projectActions";
import { getClientOrgs } from "@/app/actions/clientActions";
import { getUsers } from "@/app/actions/userActions";

export default function NewProjectWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [clientOptions, setClientOptions] = useState<{label: string, value: string}[]>([]);
  const [pmOptions, setPmOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [orgs, pms] = await Promise.all([
          getClientOrgs(),
          getUsers({ role: 'pm' })
        ]);
        setClientOptions(orgs.map(o => ({ label: o.name, value: o.id })));
        setPmOptions(pms.map(p => ({ label: p.display_name || p.id, value: p.id })));
      } catch (err) {
        console.error("Failed to load options", err);
      }
    }
    loadData();
  }, []);

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
      timeline: true,
      milestones: true,
      collaboration: true,
      materials: false,
      drawings: false,
      issues: false,
      changes: false,
      resources: false
    },
    initial_resources: [] as { name: string, type: string, hours: string }[]
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleCreate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("po_reference", formData.poRef);
    data.append("contract_value", formData.contractValue);
    data.append("target_date", formData.targetDate);
    data.append("initial_resources", JSON.stringify(formData.initial_resources));
    data.append("portal", "pm");
    
    // In a real implementation we would get proper UUIDs from the dropdown. 
    if (formData.pm) data.append("assigned_pm_id", formData.pm);
    if (formData.clientOrg) data.append("client_org_id", formData.clientOrg);
    
    await createProject(data);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="New Project Provisioning" 
        subtitle="Initialize a new project and configure its tracking modules"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/pm" className="hover:text-primary transition-colors">PM Workspace</Link>
            <span>/</span>
            <Link href="/pm/projects" className="hover:text-primary transition-colors">Projects</Link>
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
              { label: "Resource Allotment" },
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
                  <Select 
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
                  <Select 
                    value={formData.clientOrg}
                    onChange={(e: any) => setFormData({...formData, clientOrg: e.target.value})}
                    options={[
                      { label: "Select Client...", value: "" },
                      ...clientOptions
                    ]}
                  />
                </FormField>
                <FormField label="Primary Discipline *">
                  <Select 
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
                  <Select 
                    value={formData.pm}
                    onChange={(e: any) => setFormData({...formData, pm: e.target.value})}
                    options={[
                      { label: "Select PM...", value: "" },
                      ...pmOptions
                    ]}
                  />
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-merriweather text-xl font-bold text-on-surface">Resource Allotment</h3>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, initial_resources: [...formData.initial_resources, { name: "", type: "Labor", hours: "0" }] })}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-semibold hover:bg-primary/20"
                >
                  + Add Resource
                </button>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">Allocate initial resources to this project. You can add more later from the project dashboard.</p>
              
              {formData.initial_resources.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-outline-variant rounded-lg bg-surface-variant/20">
                  <p className="text-sm text-on-surface-variant">No initial resources allocated.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.initial_resources.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-surface border border-outline-variant rounded-lg p-3">
                      <div className="flex-1">
                        <TextInput 
                          placeholder="Resource Name (e.g. Lead Engineer)" 
                          value={res.name}
                          onChange={(e: any) => {
                            const updated = [...formData.initial_resources];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, initial_resources: updated });
                          }}
                        />
                      </div>
                      <div className="w-32">
                        <Select 
                          options={[{label: "Labor", value: "Labor"}, {label: "Equipment", value: "Equipment"}]}
                          value={res.type}
                          onChange={(e: any) => {
                            const updated = [...formData.initial_resources];
                            updated[idx].type = e.target.value;
                            setFormData({ ...formData, initial_resources: updated });
                          }}
                        />
                      </div>
                      <div className="w-24">
                        <TextInput 
                          type="number"
                          placeholder="Hours" 
                          value={res.hours}
                          onChange={(e: any) => {
                            const updated = [...formData.initial_resources];
                            updated[idx].hours = e.target.value;
                            setFormData({ ...formData, initial_resources: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.initial_resources];
                          updated.splice(idx, 1);
                          setFormData({ ...formData, initial_resources: updated });
                        }}
                        className="p-2 text-on-surface-variant hover:text-semantic-crimson rounded-md hover:bg-semantic-crimson/10 transition-colors"
                      >
                        <span className="sr-only">Remove</span>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-normal">
              <h3 className="font-merriweather text-xl font-bold text-on-surface mb-2">Module Configuration</h3>
              <p className="text-sm text-on-surface-variant mb-6">Enable or disable specific tracking modules for this project. This can be changed later in Project Settings.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Material Tracking</h4>
                    <p className="text-sm text-on-surface-variant">Track POs, deliveries, and field receipts</p>
                  </div>
                  <Toggle checked={formData.modules.materials} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, materials: c}})} />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Drawing Hub</h4>
                    <p className="text-sm text-on-surface-variant">Manage architectural and engineering blueprints</p>
                  </div>
                  <Toggle checked={formData.modules.drawings} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, drawings: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Issues Logger</h4>
                    <p className="text-sm text-on-surface-variant">Log defects, snags, and site blockers</p>
                  </div>
                  <Toggle checked={formData.modules.issues} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, issues: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Change Requests</h4>
                    <p className="text-sm text-on-surface-variant">Manage scope variations and financial approvals</p>
                  </div>
                  <Toggle checked={formData.modules.changes} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, changes: c}})} />
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface">Resource Tracking</h4>
                    <p className="text-sm text-on-surface-variant">Timesheets and workforce allocation metrics</p>
                  </div>
                  <Toggle checked={formData.modules.resources} onChange={(c: any) => setFormData({...formData, modules: {...formData.modules, resources: c}})} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
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
