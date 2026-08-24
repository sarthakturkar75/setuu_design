"use client";

import React from 'react';
import Link from 'next/link';

export function FinancialHealthWidget({ kpis, riskScore, laborBurn }: any) {
  return (
    <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 h-full cursor-grab active:cursor-grabbing relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10"></div>
      <h3 className="font-bold font-merriweather text-on-surface mb-4">Financial Health</h3>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-outline-variant/50 pb-2">
          <span className="text-sm text-on-surface-variant font-medium">Budget Variance</span>
          <span className={`font-bold font-mono ${kpis.budgetVariance > 0 ? 'text-semantic-crimson' : 'text-semantic-emerald'}`}>
            {kpis.budgetVariance > 0 ? '+' : ''}{kpis.budgetVariance}%
          </span>
        </div>

        {/* Real-time Turnstile Labor Burn */}
        <div className="flex justify-between border-b border-outline-variant/50 pb-2">
          <div className="flex flex-col">
            <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
              Active Labor Cost
              <span className="w-1.5 h-1.5 bg-semantic-emerald rounded-full animate-pulse" title="Live via Turnstile API"></span>
            </span>
          </div>
          <span className="font-bold font-mono text-primary">
            ${(laborBurn?.totalBurn || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between border-b border-outline-variant/50 pb-2">
          <span className="text-sm text-on-surface-variant font-medium">Risk Score</span>
          <span className={`font-bold font-mono ${riskScore > 50 ? 'text-semantic-crimson' : 'text-semantic-amber'}`}>
            {riskScore} / 100
          </span>
        </div>
      </div>
    </div>
  );
}

export function IssueTrackerWidget({ issuesCount, url }: any) {
  return (
    <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 h-full cursor-grab active:cursor-grabbing">
      <h3 className="font-bold font-merriweather text-on-surface mb-4">Issue Tracker</h3>
      <div className="flex flex-col items-center justify-center py-4">
        <span className="text-4xl font-bold text-semantic-amber">{issuesCount}</span>
        <span className="text-sm text-on-surface-variant">Open Issues</span>
      </div>
      <Link href={url} className="text-primary text-sm hover:underline block text-center mt-2">View All Issues</Link>
    </div>
  );
}

export function TimelineWidget({ progress, targetDays, url }: any) {
  return (
    <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 h-full cursor-grab active:cursor-grabbing">
      <h3 className="font-bold font-merriweather text-on-surface mb-4">Timeline Sync</h3>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-sm">Progress</span>
          <span className="font-bold text-semantic-sky">{progress}%</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-sm">Target Delivery</span>
          <span className="font-bold">{targetDays} Days</span>
        </div>
      </div>
      <Link href={url} className="text-primary text-sm hover:underline block text-center mt-2">Open Timeline</Link>
    </div>
  );
}
