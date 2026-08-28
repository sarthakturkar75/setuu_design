"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Users } from 'lucide-react';
import Link from 'next/link';
import { getCompanyResourcePool } from "@/app/actions/teamActions";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditPersonnelModal } from "@/components/ui/EditPersonnelModal";
import { useToast } from "@/contexts/ToastContext";

export default function CompanyPersonnelPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSkill, setSearchSkill] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const toast = useToast();

  const fetchResources = async (skill?: string) => {
    setLoading(true);
    const res = await getCompanyResourcePool(skill);
    if (res.success) {
      setResources(res.data);
    } else {
      toast.error(res.error || "Failed to load resource pool");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); };

  
  const filteredResources = resources.filter(r => {
    if (!searchSkill) return true;
    const term = searchSkill.toLowerCase();
    const matchName = r.display_name?.toLowerCase().includes(term);
    const matchSkill = r.skills?.some((s: string) => s.toLowerCase().includes(term));
    return matchName || matchSkill;
  });

  const internalEmployees = filteredResources.filter(r => r.employment_type === 'Internal Employee' || !r.employment_type || r.employment_type === '');
  const externalVendors = filteredResources.filter(r => r.employment_type === 'External Vendor');
  

  const renderTable = (personnel: any[], title: string, subtitle: string) => (
    <div className="mb-8">
      <div className="mb-3">
         <h4 className="font-bold text-on-surface font-merriweather">{title}</h4>
         <p className="text-sm text-on-surface-variant">{subtitle} ({personnel.length} personnel)</p>
      </div>
      {personnel.length === 0 ? (
        <div className="p-4 bg-surface border border-outline-variant/30 text-center text-sm text-on-surface-variant rounded-lg">No matches found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-variant/30 text-xs uppercase text-on-surface-variant border-b border-outline-variant/50">
              <tr>
                <th className="px-6 py-4">Personnel</th>
                <th className="px-6 py-4">Role & Rate</th>
                <th className="px-6 py-4">Skills & Certifications</th>
                <th className="px-6 py-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {personnel.map(p => (
                <tr key={p.id} className="hover:bg-surface-variant/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-on-surface flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {p.display_name ? p.display_name.substring(0, 2).toUpperCase() : "?"}
                       </div>
                       {p.display_name || "Unknown User"}
                    </div>
                    <div className="text-xs text-on-surface-variant font-mono mt-1 text-ellipsis overflow-hidden max-w-[200px] ml-10">ID: {p.id.split('-')[0]}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="capitalize font-medium text-on-surface">{p.role}</div>
                    <div className="text-sm font-mono text-semantic-emerald font-semibold">${p.hourly_rate || 0}/hr</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                      {p.skills && p.skills.length > 0 ? p.skills.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded border border-primary/20">
                          {s}
                        </span>
                      )) : <span className="text-xs text-on-surface-variant italic">No skills tagged</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingUser(p)}
                      className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-variant inline-flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                      Edit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-surface pb-12">
      <PageHeader 
        title="Global Personnel & Resource Pool" 
        subtitle="Manage the skills, labor rates, and profiles of all company personnel."
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/pm" className="hover:text-primary transition-colors">PM Workspace</Link>
            <span>/</span>
            <span>Personnel</span>
          </div>
        }
      />
      
      {editingUser && (
        <EditPersonnelModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onRefresh={() => fetchResources(searchSkill || undefined)} 
        />
      )}

      <div className="max-w-[1400px] mx-auto w-full p-6 mt-4">
        
        <div className="p-6 border border-outline-variant/30 bg-surface-variant/20 rounded-xl mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search directory by name or skill (e.g. 'Certified Welder', 'Foreman')"
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-sm transition-colors">
              Filter Personnel
            </button>
            {searchSkill && (
              <button type="button" onClick={() => { setSearchSkill(""); }} className="px-6 py-3 bg-surface border border-outline-variant text-on-surface rounded-lg text-sm hover:bg-surface-variant transition-colors">
                Clear
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant animate-pulse flex flex-col items-center gap-4">
            <Users className="w-12 h-12 text-primary/40 opacity-50" />
            <p>Loading company personnel directory...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderTable(internalEmployees, "Internal Employees", "Direct payroll staff available for allocation.")}
            {renderTable(externalVendors, "External Vendors & Subcontractors", "Third-party talent sourced from external companies.")}
          </div>
        )}
      </div>
    </div>
  );
}
