"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { markUserSafe } from '@/app/actions/emergencyActions';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function GlobalEmergencyListener() {
  const { user } = useAuth();
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [isSafe, setIsSafe] = useState(false);
  const supabase = createClient();

  const checkForActiveEmergencies = async () => {
    if (!user) return;
    // Check if there is an active emergency requiring this user's response
    const { data } = await supabase
      .from('muster_roll_responses')
      .select('event_id, status, muster_roll_events!inner(status)')
      .eq('user_id', user.id)
      .eq('status', 'UNKNOWN')
      .eq('muster_roll_events.status', 'Active')
      .order('created_at', { ascending: false, referencedTable: 'muster_roll_events' })
      .limit(1);

    if (data && data.length > 0) {
      setActiveEvent(data[0].event_id);
      setIsSafe(false);
    } else {
      setActiveEvent(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Initial check on mount
    checkForActiveEmergencies();

    // Subscribe to new events
    const channel = supabase.channel('emergency-broadcast')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'muster_roll_events' 
      }, payload => {
        // A new emergency started somewhere. Re-check if this user is involved.
        setTimeout(checkForActiveEmergencies, 1500); // slight delay to allow responses table to populate
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'muster_roll_events',
        filter: "status=eq.Resolved"
      }, payload => {
        // Emergency resolved
        if (payload.new.id === activeEvent) {
          setActiveEvent(null);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeEvent]);

  if (!activeEvent) return null;

  const handleMarkSafe = async () => {
    if (!activeEvent || !user) return;
    await markUserSafe(activeEvent, user.id);
    setIsSafe(true);
    setTimeout(() => {
      setActiveEvent(null);
      setIsSafe(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-semantic-crimson/95 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl flex flex-col items-center justify-center p-10 text-center border-4 border-semantic-crimson">
        
        {isSafe ? (
          <>
            <div className="w-24 h-24 bg-semantic-emerald/20 text-semantic-emerald rounded-full flex items-center justify-center mb-6 animate-pulse">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold font-merriweather text-semantic-emerald mb-2">Status Logged</h1>
            <p className="text-on-surface-variant font-medium">Your PM has been notified that you are safe.</p>
            <p className="text-sm text-on-surface-variant/70 mt-4">Returning to app...</p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-semantic-crimson/20 text-semantic-crimson rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold font-merriweather text-semantic-crimson mb-4 uppercase tracking-wider">
              Emergency
            </h1>
            <p className="text-lg text-on-surface font-semibold mb-2">
              A site-wide emergency muster has been initiated.
            </p>
            <p className="text-on-surface-variant mb-8">
              Please proceed to your designated muster point immediately and confirm your safety status below.
            </p>

            <button 
              onClick={handleMarkSafe}
              className="w-full py-5 bg-semantic-emerald hover:bg-semantic-emerald/90 text-on-primary rounded-xl text-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              I Am Safe
            </button>
          </>
        )}
      </div>
    </div>
  );
}
