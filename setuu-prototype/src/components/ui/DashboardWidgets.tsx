"use client";

import React from 'react';
import Link from 'next/link';

export function FinancialHealthWidget({ kpis, riskScore }: any) {
  return (
    <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 h-full cursor-grab active:cursor-grabbing">
      <h3 className="font-bold font-merriweather text-on-surface mb-4">Financial Health</h3>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
           <span className="text-sm">Budget Variance</span>
           <span className={`font-bold ${kpis.budgetVariance > 0 ? 'text-semantic-crimson' : 'text-semantic-emerald'}`}>
             {kpis.budgetVariance > 0 ? '+' : ''}{kpis.budgetVariance}%
           </span>
        </div>
        <div className="flex justify-between border-b pb-2">
           <span className="text-sm">Risk Score</span>
           <span className={`font-bold ${riskScore > 50 ? 'text-semantic-crimson' : 'text-semantic-emerald'}`}>
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
