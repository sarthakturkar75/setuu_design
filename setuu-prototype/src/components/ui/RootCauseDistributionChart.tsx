"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function RootCauseDistributionChart({ data }: { data: { name: string, count: number }[] }) {
  if (!data || data.length === 0) return <div className="p-4 text-xs text-on-surface-variant text-center">No root cause data available</div>;

  const COLORS = ['#8A2BE2', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF6666'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}
            itemStyle={{ color: 'var(--on-surface)' }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
