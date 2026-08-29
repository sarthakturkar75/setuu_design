"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsReady(true);
      } else {
        // Wait for hash to be processed if they just clicked the link
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || session) {
            setIsReady(true);
          }
        });
        return () => authListener.subscription.unsubscribe();
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully");
      router.push('/login');
    } catch(err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return <div className="min-h-screen bg-surface flex items-center justify-center p-4">Validating session...</div>;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container border border-outline/10 rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-on-surface mb-2 text-center">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">New Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <Button variant="primary" type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
