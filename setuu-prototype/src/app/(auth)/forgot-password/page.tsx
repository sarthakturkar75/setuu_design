"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { requestPasswordReset } = await import('@/app/actions/authActions');
      const res = await requestPasswordReset(email);
      if (res.success) {
        setDone(true);
      } else {
        toast.error((res as any).error || "Failed to process request");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container border border-outline/10 rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Reset Password</h1>

        {done ? (
          <div>
            <p className="text-on-surface-variant mb-6">If an account with {email} exists, a password reset link has been sent to it.</p>
            <a href="/login" className="text-primary hover:underline">Back to Login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-on-surface-variant text-sm mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary"
                placeholder="user@example.com"
              />
            </div>
            <Button variant="primary" type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-center mt-4">
              <a href="/login" className="text-sm text-on-surface-variant hover:text-on-surface">Cancel</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
