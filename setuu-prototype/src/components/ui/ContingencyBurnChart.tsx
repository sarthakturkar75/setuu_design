"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, AlertCircle } from 'lucide-react';

interface Props {
  metrics: {
    originalContingency: number;
    usedContingency: number;
    remainingContingency: number;
    isOverdrawn: boolean;
  };
}

export function ContingencyBurnChart({ metrics }: Props) {
  const data = [
    { name: 'Used', value: Math.max(0, metrics.usedContingency), color: '#ef4444' }, // semantic-crimson
    { name: 'Remaining', value: Math.max(0, metrics.remainingContingency), color: '#10b981' } // semantic-emerald
  ];

  const burnRate = metrics.originalContingency > 0 
    ? ((metrics.usedContingency / metrics.originalContingency) * 100).toFixed(1) 
    : 0;

  return (
    <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 flex gap-6 items-center shadow-sm h-[180px]">
      <div className="flex-1 min-w-[200px] h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              stroke="none"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `$${value.toLocaleString()}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            Contingency Drawdown 
            {metrics.isOverdrawn && <AlertCircle className="w-4 h-4 text-semantic-crimson" />}
          </h3>
          <div className="text-2xl font-bold font-jetbrains-mono mt-1 text-on-surface">
            ${metrics.remainingContingency.toLocaleString()} 
            <span className="text-sm text-on-surface-variant font-normal ml-2">remaining</span>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-outline-variant/30 pt-3">
           <div>
             <div className="text-xs text-on-surface-variant">Burn Rate</div>
             <div className={`text-sm font-bold ${Number(burnRate) > 80 ? 'text-semantic-crimson' : 'text-semantic-emerald'}`}>
               {burnRate}%
             </div>
           </div>
           <div className="text-right">
             <div className="text-xs text-on-surface-variant">Original Pool</div>
             <div className="text-sm font-mono text-on-surface-variant">${metrics.originalContingency.toLocaleString()}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
