"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutData {
  name: string;
  value: number;
  color: string;
}

export function DonutChart({ data, title, totalLabel }: { data: DonutData[], title?: string, totalLabel?: string }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] relative">
      {title && <h3 className="font-merriweather font-semibold mb-2">{title}</h3>}
      <div className="relative w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--elevation-l2)' }}
              itemStyle={{ fontFamily: 'var(--font-inter)', fontSize: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-jetbrains-mono">{total}</span>
          {totalLabel && <span className="text-xs text-on-surface-variant font-inter uppercase tracking-wider">{totalLabel}</span>}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.map(item => (
          <div key={item.name} className="flex items-center text-sm font-inter">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
            <span className="text-on-surface-variant mr-1">{item.name}</span>
            <span className="font-semibold font-jetbrains-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
