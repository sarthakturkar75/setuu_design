"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { UserPlus, Shield, Building2, Send, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { inviteUser } from "@/app/actions/userActions";
import { getClientOrgs } from "@/app/actions/clientActions";

export default function InviteUserWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Project Manager",
    orgId: ""
  });

  useEffect(() => {
    async function loadOrgs() {
      try {
        const data = await getClientOrgs();
        setOrgs(data || []);
      } catch (err) {
        console.error("Failed to load organizations", err);
      }
    }
    loadOrgs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (success) {
    return (
      <div className="flex flex-col h-full bg-surface">
        <PageHeader 
          title="Invite User" 
          subtitle="Provision a new identity for Setuu platform access"
          breadcrumb={
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/users" className="hover:text-primary transition-colors">Users</Link>
              <span>/</span>
              <span className="text-on-surface font-medium">Invite</span>
            </div>
          }
        />
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full flex items-center justify-center">
          <Card className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-semantic-emerald/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-semantic-emerald" />
            </div>
            <h2 className="text-2xl font-bold font-merriweather text-on-surface mb-2">Invitation Sent!</h2>
            <p className="text-on-surface-variant max-w-md">
              An invitation email has been dispatched to <span className="font-semibold text-on-surface">{formData.email}</span> with instructions to access the platform.
            </p>
            <p className="text-sm text-on-surface-variant mt-6 animate-pulse">Redirecting to directory...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Invite User Wizard" 
        subtitle="Provision a new identity for Setuu platform access"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/users" className="hover:text-primary transition-colors">Users</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Invite</span>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <form action={async (fd: FormData) => {
          setLoading(true);
          try {
            const email = fd.get("email") as string;
            await inviteUser(email, formData.role, formData.orgId);
            setSuccess(true);
            setTimeout(() => {
              router.push("/admin/users");
            }, 2000);
          } catch (err) {
            console.error("Failed to invite user", err);
          } finally {
            setLoading(false);
          }
        }} className="flex flex-col gap-6">
          
          <Card className="p-6 border-t-4 border-t-primary">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-merriweather font-bold text-lg text-on-surface">Identity Details</h3>
                <p className="text-sm text-on-surface-variant">Basic information for the new user profile.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">First Name</label>
                <TextInput 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Last Name</label>
                <TextInput 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Connor"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Email Address</label>
                <TextInput 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Phone Number (Optional)</label>
                <TextInput 
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-t-4 border-t-semantic-amber">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
                <div className="w-10 h-10 rounded-full bg-semantic-amber/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-semantic-amber" />
                </div>
                <div>
                  <h3 className="font-merriweather font-bold text-lg text-on-surface">System Role</h3>
                  <p className="text-sm text-on-surface-variant">Determine access permissions.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Select 
                  options={[
                    { label: "Project Manager", value: "Project Manager" },
                    { label: "Site Engineer", value: "Site Engineer" },
                    { label: "Client Representative", value: "Client Representative" },
                    { label: "Vendor / Supplier", value: "Vendor" },
                    { label: "Safety Officer", value: "Safety Officer" },
                  ]}
                  value={formData.role}
                  onChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                />
                
                <div className="p-4 bg-surface-variant/50 border border-outline-variant rounded-lg">
                  <h4 className="text-sm font-bold text-on-surface mb-1 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Selected Role Privileges
                  </h4>
                  <ul className="text-xs text-on-surface-variant space-y-1 list-disc pl-4 mt-2">
                    {formData.role === "Project Manager" ? (
                      <>
                        <li>Full read/write access to assigned projects.</li>
                        <li>Can approve Change Requests & Timesheets.</li>
                        <li>Can invite Site Engineers to their projects.</li>
                      </>
                    ) : formData.role === "Site Engineer" ? (
                      <>
                        <li>Can submit Progress Updates & Issues.</li>
                        <li>Can log timesheets against assigned tasks.</li>
                        <li>Read-only access to drawings and materials.</li>
                      </>
                    ) : formData.role === "Client Representative" ? (
                      <>
                        <li>Dashboard view of approved progress only.</li>
                        <li>Can digitally sign off on Handovers.</li>
                        <li>Financial view restricted by default.</li>
                      </>
                    ) : (
                      <li>Standard access model applies. Refer to RBAC matrix.</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-t-4 border-t-semantic-blue">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
                <div className="w-10 h-10 rounded-full bg-semantic-blue/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-semantic-blue" />
                </div>
                <div>
                  <h3 className="font-merriweather font-bold text-lg text-on-surface">Organization Mapping</h3>
                  <p className="text-sm text-on-surface-variant">Assign to a client or vendor entity.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Select 
                  options={[
                    { label: "-- Select Organization (Optional) --", value: "" },
                    ...orgs.map(org => ({ label: org.name, value: org.id }))
                  ]}
                  value={formData.orgId}
                  onChange={(val) => setFormData(prev => ({ ...prev, orgId: val }))}
                />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Assigning an organization will automatically inherit its Data Loss Prevention (DLP) policies and reporting hierarchies. Leave blank if this is an internal platform user.
                </p>
              </div>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-outline-variant">
            <Link 
              href="/admin/users"
              className="px-6 py-3 border border-outline-variant bg-surface text-on-surface font-semibold rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-elevation-l1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Formal Invitation
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
