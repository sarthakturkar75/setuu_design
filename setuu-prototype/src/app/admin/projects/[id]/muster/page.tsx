"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { initiateEmergencyMuster, getActiveMusterEvents, getMusterResponses } from "@/app/actions/emergencyActions";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";

export default function MusterRollPage({ params }: { params: { id: string } }) {
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);
  const toast = useToast();
  const supabase = createClient();

  const fetchActiveEvent = async () => {
    setLoading(true);
    const events = await getActiveMusterEvents(params.id);
    if (events.length > 0) {
      setActiveEvent(events[0]);
      await fetchResponses(events[0].id);
    } else {
      setActiveEvent(null);
    }
    setLoading(false);
  };

  const fetchResponses = async (eventId: string) => {
    const res = await getMusterResponses(eventId);
    setResponses(res);
  };

  useEffect(() => {
    fetchActiveEvent();
  }, [params.id]);

  // Realtime subscription to responses
  useEffect(() => {
    if (!activeEvent) return;

    const channel = supabase.channel(`muster-${activeEvent.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'muster_roll_responses',
        filter: `event_id=eq.${activeEvent.id}`
      }, payload => {
        // Update local state instantly without refetching everything
        setResponses(current => 
          current.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeEvent]);

  const handleInitiate = async () => {
    if (!confirm("Are you sure? This will instantly lock the screens of all personnel currently on site.")) return;
    setIsInitiating(true);
    const res = await initiateEmergencyMuster(params.id);
    if (res.success) {
      toast.success("Emergency Muster Initiated!");
      await fetchActiveEvent();
    } else {
      toast.error(res.error || "Failed to initiate muster roll.");
    }
    setIsInitiating(false);
  };

  const handleResolve = async () => {
    if (!confirm("Are you sure you want to resolve this emergency?")) return;
    const { error } = await supabase.from('muster_roll_events').update({ status: 'Resolved', resolved_at: new Date().toISOString() }).eq('id', activeEvent.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Emergency Resolved.");
      setActiveEvent(null);
      setResponses([]);
    }
  };

  const safeCount = responses.filter(r => r.status === 'SAFE').length;
  const unknownCount = responses.filter(r => r.status === 'UNKNOWN').length;
  const progressPercent = responses.length > 0 ? (safeCount / responses.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-surface pb-12">
      <PageHeader 
        title="Emergency Muster Roll" 
        subtitle="Initiate site-wide lockdowns and track personnel safety in real-time."
      />
      
      <div className="max-w-5xl mx-auto w-full p-6 mt-4 space-y-8">
        
        {!activeEvent && !loading && (
          <div className="bg-surface-variant/20 border border-outline-variant/30 rounded-2xl p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-merriweather text-on-surface mb-2">Site is Secure</h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-8">
              There are no active emergencies. If an incident occurs, you can initiate a muster roll to instantly lock down all active devices on site until personnel confirm their safety.
            </p>
            <button 
              onClick={handleInitiate}
              disabled={isInitiating}
              className="px-8 py-4 bg-semantic-crimson text-on-primary rounded-xl font-bold text-lg hover:bg-semantic-crimson/90 transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
            >
              <AlertTriangle className="w-5 h-5" />
              {isInitiating ? "Initiating..." : "Initiate Emergency Muster"}
            </button>
          </div>
        )}

        {activeEvent && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Live Progress Banner */}
            <div className="bg-semantic-crimson/10 border-2 border-semantic-crimson rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 bg-semantic-crimson/30 w-full" />
              <div 
                className="absolute top-0 left-0 h-1 bg-semantic-crimson transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }} 
              />
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-semantic-crimson text-on-primary rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-semantic-crimson uppercase tracking-wider mb-1">Active Emergency</h2>
                    <p className="text-on-surface font-mono font-medium">Started: {new Date(activeEvent.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold font-jetbrains text-semantic-emerald">{safeCount}</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-semantic-emerald/70">Safe</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold font-jetbrains text-semantic-amber">{unknownCount}</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-semantic-amber/70">Unknown</div>
                  </div>
                </div>

                <button 
                  onClick={handleResolve}
                  className="px-6 py-3 bg-surface border border-outline-variant hover:bg-surface-variant text-on-surface font-bold rounded-lg transition-colors"
                >
                  Resolve Incident
                </button>
              </div>
            </div>

            {/* Responses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unknown List */}
              <div className="bg-surface border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                <div className="bg-semantic-amber/10 border-b border-semantic-amber/20 p-4 shrink-0 flex items-center justify-between">
                  <h3 className="font-bold text-semantic-amber flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Awaiting Response
                  </h3>
                  <span className="bg-semantic-amber text-on-primary text-xs font-bold px-2 py-1 rounded-full">{unknownCount}</span>
                </div>
                <div className="p-2 overflow-y-auto flex-1 bg-surface-variant/10">
                  {responses.filter(r => r.status === 'UNKNOWN').map(r => (
                    <div key={r.id} className="p-3 bg-surface border border-outline-variant/30 rounded-lg mb-2 flex justify-between items-center animate-in fade-in">
                      <div>
                        <div className="font-bold text-on-surface">{r.user_actor?.display_name || 'Unknown User'}</div>
                        <div className="text-xs text-on-surface-variant font-mono">{r.user_actor?.role} • {r.user_actor?.phone_number || 'No phone'}</div>
                      </div>
                      <div className="w-3 h-3 bg-semantic-amber rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    </div>
                  ))}
                  {unknownCount === 0 && (
                    <div className="h-full flex items-center justify-center text-sm text-on-surface-variant italic">Everyone is accounted for.</div>
                  )}
                </div>
              </div>

              {/* Safe List */}
              <div className="bg-surface border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                <div className="bg-semantic-emerald/10 border-b border-semantic-emerald/20 p-4 shrink-0 flex items-center justify-between">
                  <h3 className="font-bold text-semantic-emerald flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Accounted For
                  </h3>
                  <span className="bg-semantic-emerald text-on-primary text-xs font-bold px-2 py-1 rounded-full">{safeCount}</span>
                </div>
                <div className="p-2 overflow-y-auto flex-1 bg-surface-variant/10">
                  {responses.filter(r => r.status === 'SAFE').map(r => (
                    <div key={r.id} className="p-3 bg-surface border border-outline-variant/30 rounded-lg mb-2 flex justify-between items-center animate-in fade-in slide-in-from-left-4">
                      <div>
                        <div className="font-bold text-on-surface">{r.user_actor?.display_name || 'Unknown User'}</div>
                        <div className="text-xs text-semantic-emerald font-mono">Responded at {new Date(r.responded_at).toLocaleTimeString()}</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-semantic-emerald" />
                    </div>
                  ))}
                  {safeCount === 0 && (
                    <div className="h-full flex items-center justify-center text-sm text-on-surface-variant italic">No safe responses yet.</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
