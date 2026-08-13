"use client";

import { useState } from "react";
import { LogOutIcon, AlertTriangleIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function ForceLogoutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForceLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    // Simulate network delay for session termination
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccess(false);
      setUserId("");
      setReason("");
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full pt-12 pb-20">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Active Session Management</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Monitor and administratively terminate user sessions across the platform.
        </p>
      </div>

      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-semantic-crimson/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangleIcon className="w-8 h-8 text-semantic-crimson" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Emergency Session Termination</h3>
          <p className="text-on-surface-variant">
            Use this tool to instantly invalidate all authentication tokens for a specific user.
            This action forces an immediate logout on all devices.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-semantic-crimson text-white rounded-md font-medium hover:bg-semantic-crimson/90 transition-colors shadow-sm"
        >
          <LogOutIcon className="w-5 h-5" />
          Initiate Force Logout
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && !success && setIsModalOpen(false)}
        title="Force Session Termination"
      >
        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-semantic-emerald/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-semantic-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-semantic-emerald">Sessions Terminated</h3>
            <p className="text-sm text-on-surface-variant">The user has been disconnected from all devices.</p>
          </div>
        ) : (
          <form onSubmit={handleForceLogout} className="space-y-4 pt-2">
            <div className="bg-semantic-amber/10 border border-semantic-amber/30 p-3 rounded text-sm text-semantic-amber-on font-medium flex gap-2 items-start">
              <AlertTriangleIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <p>This action is irreversible and will be logged to the immutable audit ledger.</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="userId" className="block text-sm font-medium text-on-surface">Target User ID / Email</label>
              <input 
                id="userId"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., vendor@example.com or user_12345"
                className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-semantic-crimson focus:ring-1 focus:ring-semantic-crimson"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-on-surface">Termination Reason</label>
              <textarea 
                id="reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Compromised account, offboarding, policy violation..."
                rows={3}
                className="w-full bg-surface rounded-md border border-outline-variant p-2.5 text-sm text-on-surface focus:border-semantic-crimson focus:ring-1 focus:ring-semantic-crimson resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-on-surface bg-surface border border-outline-variant rounded-md hover:bg-surface-container disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!userId || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-semantic-crimson rounded-md hover:bg-semantic-crimson/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <LogOutIcon className="w-4 h-4" />
                    Terminate Sessions
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
