"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createInvite } from "@/app/actions/inviteActions";
import { assignTeamMember } from "@/app/actions/projectActions";
import { getCompanyResourcePool } from "@/app/actions/teamActions";
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Users } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'platform' | 'organization' | 'project';
  resourceId?: string; // project_id
}

export function InviteModal({ isOpen, onClose, defaultType = 'platform', resourceId }: InviteModalProps) {
  const { role } = useAuth();
  
  const [tab, setTab] = useState<'new' | 'existing'>('new');
  const [email, setEmail] = useState('');
  const [roleOffered, setRoleOffered] = useState('engineer');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (isOpen && tab === 'existing') {
      getCompanyResourcePool().then(data => setExistingUsers(data || []));
    }
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'new') {
        let type = defaultType;
        if (role === 'superadmin' && roleOffered === 'admin') {
          type = 'organization';
        }

        const res = await createInvite({
          email,
          inviteType: type,
          roleOffered,
          resourceId,
          orgName: role === 'superadmin' && roleOffered === 'admin' ? orgName : undefined
        });

        if (res.success) {
          toast.success(`Invite sent successfully to ${email}`);
          onClose();
        } else {
          toast.error("Failed to send invite");
        }
      } else {
        // Assign Existing
        if (defaultType === 'project' && resourceId) {
          const fd = new FormData();
          fd.append("project_id", resourceId);
          fd.append("vendor_id", selectedUserId); // using vendor_id for generic assignment
          
          const res = await assignTeamMember(fd);
          if (res.success) {
            toast.success("Successfully assigned to project");
            onClose();
          } else {
            toast.error(res.error || "Failed to assign member");
          }
        } else {
          toast.error("Assigning existing users is only supported for projects directly.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-outline/10">
          <h2 className="text-xl font-semibold text-on-surface">Manage Access</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {defaultType === 'project' && (
          <div className="flex border-b border-outline/10">
            <button 
              type="button"
              className={`flex-1 py-3 text-sm font-medium border-b-2 flex justify-center items-center gap-2 ${tab === 'new' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setTab('new')}
            >
              <Mail className="w-4 h-4" /> Invite New
            </button>
            <button 
              type="button"
              className={`flex-1 py-3 text-sm font-medium border-b-2 flex justify-center items-center gap-2 ${tab === 'existing' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setTab('existing')}
            >
              <Users className="w-4 h-4" /> Assign Existing
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'new' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Role</label>
                <select 
                  value={roleOffered}
                  onChange={e => setRoleOffered(e.target.value)}
                  className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface"
                >
                  {role === 'superadmin' && <option value="admin">Administrator (New Org)</option>}
                  <option value="pm">Project Manager</option>
                  <option value="engineer">Engineer</option>
                  <option value="vendor">Vendor</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {role === 'superadmin' && roleOffered === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">New Organization Name</label>
                  <input 
                    type="text" 
                    required 
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface"
                    placeholder="Acme Construction Co."
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Personnel</label>
                <select 
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface"
                  required
                >
                  <option value="" disabled>Choose an existing member...</option>
                  {existingUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.display_name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading || (tab === 'existing' && !selectedUserId)}>
              {loading ? "Processing..." : (tab === 'new' ? "Send Invite" : "Assign to Project")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
