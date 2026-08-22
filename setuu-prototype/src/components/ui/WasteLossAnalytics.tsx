"use client";

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export function WasteLossAnalytics({ analytics }: { analytics: { totalLoss: number, incidents: number } }) {
  if (!analytics) return null;

  return (
    <div className="bg-semantic-crimson-bg/10 border border-semantic-crimson/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-semantic-crimson/20 flex items-center justify-center text-semantic-crimson">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-semantic-crimson flex items-center gap-2">
            Material Waste & Scrap Loss 
            {analytics.totalLoss > 5000 && <AlertTriangle className="w-4 h-4" />}
          </h3>
          <p className="text-xs text-semantic-crimson/80 mt-0.5">{analytics.incidents} Incidents Logged</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-semibold text-semantic-crimson/80 uppercase tracking-wider mb-1">Financial Impact</div>
        <div className="text-2xl font-bold font-jetbrains-mono text-semantic-crimson">
          ${analytics.totalLoss.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
