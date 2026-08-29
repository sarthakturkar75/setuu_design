"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createInvite } from "@/app/actions/inviteActions";
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'platform' | 'organization' | 'project';
  resourceId?: string; // project_id
}

export function InviteModal({ isOpen, onClose, defaultType = 'platform', resourceId }: InviteModalProps) {
  const { role } = useAuth();
  const [email, setEmail] = useState('');
  const [roleOffered, setRoleOffered] = useState('engineer');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let type = defaultType;
      // If superadmin inviting an admin, it's considered an org invite
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
          <h2 className="text-xl font-semibold text-on-surface">Send Invitation</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
