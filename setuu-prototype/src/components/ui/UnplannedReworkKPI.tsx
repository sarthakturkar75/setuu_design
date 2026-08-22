"use client";

import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

export function UnplannedReworkKPI({ totalCost }: { totalCost: number }) {
  const isHigh = totalCost > 10000;
  
  return (
    <div className={`p-4 rounded-xl border ${isHigh ? 'bg-semantic-crimson-bg/10 border-semantic-crimson/30' : 'bg-surface-container-lowest border-outline-variant/50'} flex flex-col justify-between h-full`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${isHigh ? 'bg-semantic-crimson/20 text-semantic-crimson' : 'bg-primary/10 text-primary'}`}>
          <DollarSign className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-on-surface">Unplanned Rework</h3>
      </div>
      
      <div>
        <div className={`text-2xl font-bold font-jetbrains-mono ${isHigh ? 'text-semantic-crimson' : 'text-on-surface'}`}>
          ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
          <TrendingUp className="w-3 h-3" /> Cumulative financial bleed
        </div>
      </div>
    </div>
  );
}
