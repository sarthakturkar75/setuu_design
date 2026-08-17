"use client";

import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { AlertTriangle, UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForceLogoutPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForceLogout = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      router.push("/admin/users");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-surface-variant relative overflow-hidden">
      
      {/* Background pattern for "modal" feel */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        <Link href="/admin/users" className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors shadow-elevation-l1">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <Card className="w-full max-w-lg shadow-elevation-l3 overflow-hidden border-2 border-crimson/30 animate-in zoom-in-95 duration-200">
          
          <div className="p-6 bg-crimson/10 border-b border-crimson/20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center shadow-elevation-l2">
              <UserX className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-crimson">Force Global Logout</h2>
              <p className="text-sm text-on-surface-variant mt-2 max-w-[300px] mx-auto leading-relaxed">
                You are about to terminate all active sessions for this user across all devices immediately.
              </p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 bg-surface">
            
            <div className="flex items-start gap-3 p-4 bg-semantic-amber/10 border border-semantic-amber/30 rounded-lg text-sm text-on-surface">
              <AlertTriangle className="w-5 h-5 text-semantic-amber shrink-0 mt-0.5" />
              <p>
                This action is logged in the immutable Audit Ledger. The user will be instantly redirected to the login screen and any unsaved work may be lost.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
                Reason for Termination <span className="text-crimson">*</span>
              </label>
              <textarea 
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none min-h-[100px] resize-none"
                placeholder="e.g., Suspicious login activity detected from unauthorized IP..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <span className="text-xs text-on-surface-variant">Required for compliance auditing.</span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={() => router.back()}
                className="flex-1 px-4 py-2.5 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleForceLogout}
                disabled={reason.length < 5 || isSubmitting}
                className="flex-1 px-4 py-2.5 bg-crimson text-white rounded-lg text-sm font-semibold hover:bg-crimson/90 transition-colors shadow-elevation-l1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    Terminate Sessions
                  </>
                )}
              </button>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}
