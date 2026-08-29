"use client";
import { InviteModal } from "@/components/modals/InviteModal";
import { useState } from "react";

import * as React from "react";
import { getProjectResources, deleteResource } from "@/app/actions/resourceActions";
import { getProjectTeam, removeTeamMember } from "@/app/actions/projectActions";
import { getProjectPermissions } from "@/app/actions/permissionActions";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { ResourcePoolModal } from "@/components/ui/ResourcePoolModal";
import { EditPermissionsModal } from "@/components/ui/EditPermissionsModal";
import { CreateResourceModal } from "@/components/ui/CreateResourceModal";
import { UsersIcon, Trash2, ShieldAlert, ChevronDown, ChevronRight, Settings2, Plus, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProjectTeamPage() {
	const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { user: currentUser, role: currentRole } = useAuth();
  
  const [team, setTeam] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [permissions, setPermissions] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(true);
  
  const [showAssignForm, setShowAssignForm] = React.useState(false);
  const [showAddResource, setShowAddResource] = React.useState(false);
  const [editingAccessUser, setEditingAccessUser] = React.useState<any>(null);

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    internal: true,
    vendors: true,
    clients: true,
    resources: true
  });

  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  const fetchTeam = React.useCallback(async () => {
    if (!id) return;
    try {
      const [teamData, resourceData, permsData] = await Promise.all([
        getProjectTeam(id),
        getProjectResources({ projectId: id }),
        getProjectPermissions(id)
      ]);
      
      const permMap: Record<string, any> = {};
      if (permsData) {
        permsData.forEach((p: any) => {
          permMap[p.user_id] = p;
        });
      }
      
      setPermissions(permMap);
      setTeam(teamData || []);
      setResources(resourceData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member? Historical logs will be preserved, but they will instantly lose access to the project.")) return;
    const res = await removeTeamMember(id, userId);
    if (res.success) {
      toast.success("Member removed");
      fetchTeam();
    } else {
      toast.error("Failed to remove member: " + res.error);
    }
  };

  const handleRemoveResource = async (resourceId: string) => {
    if (!confirm("Remove this generic resource from the project?")) return;
    const res = await deleteResource(resourceId);
    if (res.success) {
      toast.success("Resource removed");
      fetchTeam();
    } else {
      toast.error("Failed to remove resource: " + res.error);
    }
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isManager = currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'pm';

  const renderMemberTable = (members: any[], title: string, subtitle: string, sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-8">
        <div 
          className="mb-3 flex justify-between items-center cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div>
            <h3 className="text-lg font-bold font-merriweather text-on-surface flex items-center gap-2">
              {isExpanded ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-primary" />}
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant ml-7">{subtitle}</p>
          </div>
        </div>
        
        {isExpanded && (
          <div className="bg-surface rounded-xl border border-outline-variant/50 overflow-hidden ml-7 shadow-sm">
            {members.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">No members assigned to this category.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/30 text-xs uppercase text-on-surface-variant border-b border-outline-variant/30">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Personnel & Org</th>
                    <th className="px-4 py-3 font-semibold">Role & Rate</th>
                    <th className="px-4 py-3 font-semibold text-center">Core Access</th>
                    {isManager && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {members.map(row => {
                    const hasFullAccess = row.role === 'admin' || row.role === 'superadmin';
                    const drawingsAccess = hasFullAccess || permissions[row.id]?.can_view_drawings;
                    const financialsAccess = hasFullAccess || permissions[row.id]?.can_view_financials;
                    
                    const isSelfAdmin = row.role === 'admin' && currentUser?.id === row.id;

                    return (
                      <tr key={row.id} className="hover:bg-surface-variant/10 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {row.fallback || '?'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface">{row.name} {isSelfAdmin && "(You)"}</span>
                              <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                                <Briefcase className="w-3 h-3" /> {row.organization_name || "No Organization"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">{row.role}</span>
                            <span className="text-xs text-on-surface-variant opacity-80">${row.hourly_rate || 0}/hr</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {hasFullAccess ? (
                              <span className="text-xs font-bold text-semantic-emerald uppercase bg-semantic-emerald/10 px-2 py-1 rounded">Full Admin Access</span>
                            ) : (
                              <>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${drawingsAccess ? 'bg-semantic-emerald/10 text-semantic-emerald' : 'bg-surface-variant text-on-surface-variant'}`}>
                                  {drawingsAccess ? 'Drawings' : 'No Drawings'}
                                </span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${financialsAccess ? 'bg-semantic-emerald/10 text-semantic-emerald' : 'bg-surface-variant text-on-surface-variant'}`}>
                                  {financialsAccess ? 'Financials' : 'No Financials'}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        {isManager && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              {!hasFullAccess && (
                                <button 
                                  onClick={() => setEditingAccessUser(row)}
                                  className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold border border-outline-variant/50"
                                >
                                  <Settings2 className="w-4 h-4" /> Edit Access
                                </button>
                              )}
                              {!isSelfAdmin && (
                                <button 
                                  onClick={() => handleRemoveMember(row.id)}
                                  className="p-2 text-semantic-crimson hover:bg-semantic-crimson/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                                >
                                  <Trash2 className="w-4 h-4" /> Remove
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-12 text-center text-on-surface-variant animate-pulse">Loading team roster...</div>;
  }

  const internals = team.filter(t => t.employment_type === 'Internal Employee' || !t.employment_type || t.employment_type === '');
  const vendors = team.filter(t => t.employment_type === 'External Vendor' && t.role !== 'client');
  const clients = team.filter(t => t.role === 'client');

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Team Roster & Security</h2>
          <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-semantic-warning" />
            Only these assigned members have explicit access to this project workspace.
          </p>
        </div>
        {isManager && (
          <button 
            onClick={() => setShowAssignForm(!showAssignForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            <UsersIcon className="w-4 h-4" />
            {showAssignForm ? "Close Pool" : "Assign Personnel"}
          </button>
        )}
      </div>

      {showAssignForm && (
        <ResourcePoolModal 
          projectId={id}
          onClose={() => setShowAssignForm(false)}
          onRefresh={fetchTeam}
          currentTeamIds={team.map(t => t.id)}
        />
      )}
      
      {showAddResource && (
        <CreateResourceModal 
          projectId={id}
          onClose={() => setShowAddResource(false)}
          onRefresh={fetchTeam}
        />
      )}

      {editingAccessUser && (
        <EditPermissionsModal 
          projectId={id}
          user={editingAccessUser}
          permissions={permissions[editingAccessUser.id] || {}}
          onClose={() => setEditingAccessUser(null)}
          onRefresh={fetchTeam}
        />
      )}

      {team.length === 0 && (
        <div className="p-12 text-center text-on-surface-variant bg-surface rounded-xl border border-dashed border-outline-variant/50">
          No personnel assigned to this project yet. {isManager && 'Click "Assign Personnel" to add members.'}
        </div>
      )}

      {renderMemberTable(internals, "Internal Employees", "Direct payroll staff managing the project execution.", "internal")}
      {renderMemberTable(vendors, "External Contractors & Vendors", "Third-party talent sourced from external companies.", "vendors")}
      {renderMemberTable(clients, "Clients & Stakeholders", "External partners with limited viewing access.", "clients")}

      {/* General Resources */}
      <div className="mt-12 pt-8 border-t border-outline-variant/30">
        <div 
          className="mb-4 flex justify-between items-center cursor-pointer p-2 hover:bg-surface-variant/20 rounded-lg transition-colors"
          onClick={() => toggleSection("resources")}
        >
          <div>
            <h3 className="text-lg font-bold font-merriweather text-on-surface flex items-center gap-2">
              {expandedSections["resources"] ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-primary" />}
              General Resources (Labor & Equipment)
            </h3>
            <p className="text-sm text-on-surface-variant ml-7">Generic resources blocked out for budget and scheduling.</p>
          </div>
          {isManager && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAddResource(true); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant text-on-surface rounded-lg text-xs font-semibold hover:bg-outline-variant transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Resource
            </button>
          )}
        </div>
        
        {expandedSections["resources"] && (
          <div className="bg-surface rounded-xl border border-outline-variant/50 overflow-hidden shadow-sm ml-7">
            {resources.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">No generic resources allocated.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant/30 text-xs uppercase text-on-surface-variant border-b border-outline-variant/30">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Resource / Group</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Allocated</th>
                    <th className="px-4 py-3 font-semibold">Actual</th>
                    {isManager && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {resources.map(row => (
                    <tr key={row.id} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-4 py-3 font-semibold text-on-surface">{row.name}</td>
                      <td className="px-4 py-3 text-on-surface-variant capitalize">{row.resource_type}</td>
                      <td className="px-4 py-3 font-jetbrains-mono">{row.allocated_hours}h</td>
                      <td className="px-4 py-3 font-jetbrains-mono">{row.actual_hours || 0}h</td>
                      {isManager && (
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleRemoveResource(row.id)}
                            className="p-2 text-semantic-crimson hover:bg-semantic-crimson/10 rounded-lg transition-colors inline-flex items-center gap-2 text-xs font-semibold"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} defaultType="project" resourceId={params.id as string} />
    </div>
  );
}