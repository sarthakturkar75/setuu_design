"use client";

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export function SLACountdownTimer({ deadlineIso }: { deadlineIso: string }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, mins: number, breached: boolean }>({ hours: 0, mins: 0, breached: false });

  useEffect(() => {
    if (!deadlineIso) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(deadlineIso).getTime();
      const diff = deadline - now;
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, mins: 0, breached: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, mins, breached: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineIso]);

  if (!deadlineIso) return <span className="text-xs text-on-surface-variant italic">No SLA</span>;

  if (timeLeft.breached) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-semantic-crimson-bg/10 text-semantic-crimson text-xs font-bold font-mono">
        <AlertTriangle className="w-3.5 h-3.5" /> SLA BREACHED
      </div>
    );
  }

  // Warning state: less than 4 hours
  const isWarning = timeLeft.hours < 4;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold font-mono ${isWarning ? 'bg-semantic-amber-bg/20 text-semantic-amber' : 'bg-surface-variant text-on-surface-variant'}`}>
      <Clock className="w-3.5 h-3.5" />
      {timeLeft.hours}h {timeLeft.mins}m
    </div>
  );
}
