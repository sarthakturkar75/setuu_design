"use client";

import React, { useEffect, useState } from "react";
import { getCompanyResourcePool } from "@/app/actions/teamActions";
import { assignTeamMember } from "@/app/actions/projectActions";
import { useToast } from "@/contexts/ToastContext";
import { Search, X, UserPlus, Filter, Edit2, ChevronDown, ChevronRight, Briefcase } from "lucide-react";
import { EditPersonnelModal } from "./EditPersonnelModal";

export function ResourcePoolModal({ projectId, onClose, onRefresh, currentTeamIds }: { projectId: string, onClose: () => void, onRefresh: () => void, currentTeamIds: string[] }) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchSkill, setSearchSkill] = useState("");
  const [searchOrg, setSearchOrg] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    internal: true,
    external: true
  });
  
  const toast = useToast();

  const fetchResources = async () => {
    setLoading(true);
    const res = await getCompanyResourcePool();
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

  const handleAssign = async (userId: string) => {
    setSubmittingId(userId);
    const fd = new FormData();
    fd.append("project_id", projectId);
    fd.append("vendor_id", userId);
    
    const res = await assignTeamMember(fd);
    if (res.success) {
      toast.success("Successfully assigned to project");
      onRefresh();
      // Optional: don't close, let them keep assigning
    } else {
      toast.error(res.error || "Failed to assign personnel");
    }
    setSubmittingId(null);
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Grouping & Filtering
  const filteredResources = resources.filter(r => {
    const matchName = !searchName || r.display_name?.toLowerCase().includes(searchName.toLowerCase());
    const matchSkill = !searchSkill || r.skills?.some((s: string) => s.toLowerCase().includes(searchSkill.toLowerCase()));
    const matchOrg = !searchOrg || r.organization_name?.toLowerCase().includes(searchOrg.toLowerCase());
    
    return matchName && matchSkill && matchOrg;
  });

  const internalEmployees = filteredResources.filter(r => r.employment_type === 'Internal Employee' || !r.employment_type || r.employment_type === '');
  const externalVendors = filteredResources.filter(r => r.employment_type === 'External Vendor');

  const renderTable = (personnel: any[], title: string, subtitle: string, sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-8">
        <div 
          className="mb-3 flex justify-between items-center cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div>
            <h4 className="font-bold text-on-surface font-merriweather flex items-center gap-2">
              {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-primary" />}
              {title}
            </h4>
            <p className="text-xs text-on-surface-variant ml-6">{subtitle} ({personnel.length} found)</p>
          </div>
        </div>
        
        {isExpanded && (
          personnel.length === 0 ? (
            <div className="p-4 bg-surface border border-outline-variant/30 text-center text-sm text-on-surface-variant rounded-lg ml-6">No matches found.</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-outline-variant/50 bg-surface ml-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/30 text-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Name & Org</th>
                    <th className="px-4 py-3">Role & Rate</th>
                    <th className="px-4 py-3">Skills (Tags)</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {personnel.map(p => (
                    <tr key={p.id} className="hover:bg-surface-variant/10">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-on-surface">{p.display_name || "Unknown User"}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {p.organization_name || "No Organization"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="capitalize">{p.role}</div>
                        <div className="text-xs font-mono text-semantic-emerald">${p.hourly_rate || 0}/hr</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.skills && p.skills.length > 0 ? p.skills.map((s: string) => (
                            <span key={s} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded">{s}</span>
                          )) : <span className="text-xs text-on-surface-variant italic">No skills tagged</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(p)}
                          className="px-3 py-1.5 bg-surface-variant text-on-surface rounded text-xs font-semibold hover:bg-outline-variant inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button 
                          disabled={submittingId === p.id || currentTeamIds.includes(p.id)}
                          onClick={() => handleAssign(p.id)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 ${currentTeamIds.includes(p.id) ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50'}`}
                        >
                          <UserPlus className="w-3 h-3" />
                          {currentTeamIds.includes(p.id) ? 'Assigned' : (submittingId === p.id ? 'Assigning...' : 'Assign')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <>
    {editingUser && (
      <EditPersonnelModal 
        user={editingUser} 
        onClose={() => setEditingUser(null)} 
        onRefresh={() => fetchResources()} 
      />
    )}
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30">
        
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
          <div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 font-merriweather">
              <Filter className="w-5 h-5 text-primary" /> Company Resource Pool
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">Filter and recruit company-wide talent for this project.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 border-b border-outline-variant/30 bg-surface-variant/20">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search Name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
              />
            </div>
            <div className="relative flex-1">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Filter Skills..."
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
              />
            </div>
            <div className="relative flex-1">
              <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Filter Organization..."
                value={searchOrg}
                onChange={e => setSearchOrg(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
              />
            </div>
            {(searchName || searchSkill || searchOrg) && (
              <button type="button" onClick={() => { setSearchName(""); setSearchSkill(""); setSearchOrg(""); }} className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded-lg text-sm hover:bg-surface-variant shrink-0">
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant animate-pulse">Loading company directory...</div>
          ) : (
            <>
              {renderTable(internalEmployees, "Internal Employees", "Direct payroll staff available for allocation.", "internal")}
              {renderTable(externalVendors, "External Vendors & Subcontractors", "Third-party talent sourced from external companies.", "external")}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
