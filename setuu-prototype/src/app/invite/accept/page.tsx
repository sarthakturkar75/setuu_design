"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { validateInviteToken, acceptInvite } from "@/app/actions/inviteActions";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [inviteDetails, setInviteDetails] = useState<any>(null);
  const [error, setError] = useState('');

  // Form state
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No token provided");
      setLoading(false);
      return;
    }

    validateInviteToken(token).then(res => {
      if (res.valid) {
        setInviteDetails(res.invite);
      } else {
        setError(res.error || "Invalid token");
      }
      setLoading(false);
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteDetails.email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        // If user already registered, we should just try to log them in or accept invite directly
        if (authError.message.includes("already registered")) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: inviteDetails.email,
            password
          });
          if (signInErr) throw new Error("Email already registered. Please use your existing password.");

          // Proceed to accept invite
          const sessionData = await supabase.auth.getSession();
          if (sessionData.data.session?.user.id) {
            await acceptInvite(token!, sessionData.data.session.user.id);
            toast.success("Invite accepted successfully!");
            router.push(`/${inviteDetails.role_offered}`);
            return;
          }
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Failed to create user");

      // 2. Accept invite in the database
      await acceptInvite(token!, authData.user.id);

      toast.success("Account created and invite accepted!");
      router.push(`/${inviteDetails.role_offered}`);

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface">Validating invite...</div>;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4">
      <div className="bg-surface-container border border-error/20 p-8 rounded-xl max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-error mb-4">Invalid Invitation</h1>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <Button variant="primary" onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="bg-surface-container border border-outline/10 p-8 rounded-xl max-w-md w-full shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">You've been invited!</h1>
          <p className="text-on-surface-variant">
            <strong>{inviteDetails.inviterName}</strong> has invited you to join <strong>{inviteDetails.targetName}</strong> as a <strong>{inviteDetails.role_offered}</strong>.
          </p>
          <p className="text-sm text-on-surface-variant mt-2">
            Invited email: {inviteDetails.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg px-4 py-2 text-on-surface"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Set a Password (or enter existing if already registered)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg px-4 py-2 text-on-surface"
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Accept Invitation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
