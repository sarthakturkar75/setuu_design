"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { WizardStepper } from "@/components/ui/WizardStepper";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { ArrowLeft, Rocket, UploadCloud, Building2, CreditCard, ShieldCheck, CheckCircle2, ChevronRight, ServerCrash, UserPlus, Users, Mail, DollarSign } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientOrg } from "@/app/actions/clientActions";

export default function ClientOnboardingPage() {
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orgName: "",
    domain: "",
    sector: "cre",
    subscriptionTier: "Enterprise",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvision = async () => {
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("name", formData.orgName);
    fd.append("subscription_tier", formData.subscriptionTier);
    
    const result = await createClientOrg(fd);
    setIsSubmitting(false);
    
    if (result.success) {
      router.push("/admin/users");
    } else {
      console.error(result.error);
    }
  };

  const steps = [
    { id: 1, label: "Organization Profile", icon: <Building2 className="w-4 h-4" /> },
    { id: 2, label: "Subscription & Limits", icon: <DollarSign className="w-4 h-4" /> },
    { id: 3, label: "Primary Contact", icon: <Users className="w-4 h-4" /> },
    { id: 4, label: "Review & Launch", icon: <Rocket className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader
        title="Client Onboarding Wizard"
        subtitle="Provision a new isolated client organization environment"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Clients</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Onboarding</span>
          </div>
        }
        actions={
          <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 max-w-300 mx-auto w-full flex flex-col gap-8">

        <WizardStepper steps={steps} currentStep={activeStep - 1} />

        <Card className="p-8 shadow-elevation-l1">
          {activeStep === 1 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-2">Organization Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">Organization Name <span className="text-crimson">*</span></label>
                  <TextInput 
                    placeholder="e.g., Apex Construction Partners" 
                    value={formData.orgName}
                    onChange={(e) => handleInputChange("orgName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">Primary Domain <span className="text-crimson">*</span></label>
                  <TextInput 
                    placeholder="e.g., apexbuild.com" 
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                  />
                  <span className="text-xs text-on-surface-variant">Used for SSO and email whitelisting.</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">Industrial Sector</label>
                  <Select
                    options={[
                      { label: "Commercial Real Estate", value: "cre" },
                      { label: "Heavy Infrastructure", value: "heavy" },
                      { label: "Residential Development", value: "res" },
                      { label: "Government / Public Sector", value: "gov" },
                    ]}
                    value={formData.sector}
                    onChange={(val) => handleInputChange("sector", val)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-semibold text-on-surface">Corporate Branding (Optional)</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-variant/30 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-on-surface-variant mb-2" />
                  <span className="font-medium text-on-surface">Upload Company Logo</span>
                  <span className="text-xs text-on-surface-variant mt-1">PNG, JPG up to 5MB. Transparent background recommended.</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-2">Subscription Tier & Project Limits</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Starter Tier */}
                <div 
                  onClick={() => handleInputChange("subscriptionTier", "Starter")}
                  className={`p-6 rounded-xl border transition-colors cursor-pointer flex flex-col gap-4 ${formData.subscriptionTier === "Starter" ? "border-2 border-primary bg-primary/5 shadow-elevation-l1" : "border-outline-variant bg-surface hover:border-primary/50"}`}>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-on-surface">Starter</span>
                    <span className="text-sm text-on-surface-variant mt-1">For small contractors</span>
                  </div>
                  <div className="text-3xl font-bold text-primary my-2 font-jetbrains">$499<span className="text-sm text-on-surface-variant font-medium">/mo</span></div>
                  <ul className="flex flex-col gap-2 text-sm text-on-surface">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 3 Active Projects</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10 Admin Users</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 500GB Storage</li>
                  </ul>
                </div>

                {/* Enterprise Tier */}
                <div 
                  onClick={() => handleInputChange("subscriptionTier", "Enterprise")}
                  className={`p-6 rounded-xl border transition-colors cursor-pointer flex flex-col gap-4 relative overflow-hidden ${formData.subscriptionTier === "Enterprise" ? "border-2 border-primary bg-primary/5 shadow-elevation-l1" : "border-outline-variant bg-surface hover:border-primary/50"}`}>
                  <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">Recommended</div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-primary">Enterprise</span>
                    <span className="text-sm text-on-surface-variant mt-1">Full-scale portfolio management</span>
                  </div>
                  <div className="text-3xl font-bold text-primary my-2 font-jetbrains">$1,999<span className="text-sm text-on-surface-variant font-medium">/mo</span></div>
                  <ul className="flex flex-col gap-2 text-sm text-on-surface">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Projects</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Users</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10TB Storage</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> White-glove Support</li>
                  </ul>
                </div>

                {/* Custom Tier */}
                <div 
                  onClick={() => handleInputChange("subscriptionTier", "Custom Build")}
                  className={`p-6 rounded-xl border transition-colors cursor-pointer flex flex-col gap-4 ${formData.subscriptionTier === "Custom Build" ? "border-2 border-primary bg-primary/5 shadow-elevation-l1" : "border-outline-variant bg-surface hover:border-primary/50"}`}>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-on-surface">Custom Build</span>
                    <span className="text-sm text-on-surface-variant mt-1">Mega-projects & consortia</span>
                  </div>
                  <div className="text-3xl font-bold text-on-surface my-2 font-jetbrains">Contact Sales</div>
                  <ul className="flex flex-col gap-2 text-sm text-on-surface">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated Instances</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom SLA</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> On-Premise Sync</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-on-surface">Primary Organization Admin</h2>
                <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
                  <UserPlus className="w-4 h-4" /> Add New User
                </button>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-on-surface leading-relaxed">
                  This user will receive the initial login credentials and will have full administrative rights over the new Organization. They will be responsible for inviting the rest of their team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">First Name <span className="text-crimson">*</span></label>
                  <TextInput 
                    placeholder="e.g., Robert" 
                    value={formData.adminFirstName}
                    onChange={(e) => handleInputChange("adminFirstName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">Last Name <span className="text-crimson">*</span></label>
                  <TextInput 
                    placeholder="e.g., House" 
                    value={formData.adminLastName}
                    onChange={(e) => handleInputChange("adminLastName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-on-surface">Corporate Email <span className="text-crimson">*</span></label>
                  <TextInput 
                    placeholder="e.g., rhouse@apexbuild.com" type="email" 
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-on-surface">Contact Phone</label>
                  <TextInput 
                    placeholder="+1 (555) 123-4567" type="tel" 
                    value={formData.adminPhone}
                    onChange={(e) => handleInputChange("adminPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-on-surface">Review & Launch</h2>
                <span className="px-3 py-1 bg-emerald-500/10 text-semantic-emerald text-sm font-bold rounded-full">Ready for Provisioning</span>
              </div>

              <div className="flex flex-col gap-6 p-6 rounded-xl border border-outline-variant bg-surface-variant/20">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Organization Identity</span>
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2 mt-2">
                    <span className="text-on-surface-variant">Name</span>
                    <span className="font-semibold text-on-surface">{formData.orgName || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant">Domain</span>
                    <span className="font-semibold text-on-surface">{formData.domain || "Not specified"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Subscription</span>
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2 mt-2">
                    <span className="text-on-surface-variant">Selected Tier</span>
                    <span className="font-semibold text-on-surface">{formData.subscriptionTier}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Primary Admin</span>
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2 mt-2">
                    <span className="text-on-surface-variant">User</span>
                    <span className="font-semibold text-on-surface">{formData.adminFirstName} {formData.adminLastName} ({formData.adminEmail || "No email"})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="terms" className="text-sm text-on-surface-variant">I confirm these details are accurate and authorize billing initiation.</label>
              </div>
            </div>
          )}

          {/* Wizard Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-outline-variant">
            <button
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-6 py-2.5 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/admin/users")}
                className="px-6 py-2.5 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              {activeStep < 4 ? (
                <button
                  onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1"
                >
                  Continue to {steps[activeStep].label}
                </button>
              ) : (
                <button
                  onClick={handleProvision}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-2.5 bg-semantic-emerald text-white rounded-lg text-sm font-bold hover:bg-semantic-emerald/90 transition-colors shadow-elevation-l2 disabled:opacity-50"
                >
                  <Rocket className="w-4 h-4" />
                  {isSubmitting ? "Provisioning..." : "Provision Environment"}
                </button>
              )}
            </div>
          </div>

        </Card>

      </div>
    </div>
  );
}
