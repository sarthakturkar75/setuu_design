"use client";
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarData {
  [key: string]: string | number;
}

export function BarChart({ 
  data, 
  keys, 
  colors,
  xAxisKey = 'name',
  height = 300 
}: { 
  data: BarData[], 
  keys: string[], 
  colors: string[],
  xAxisKey?: string,
  height?: number 
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-inter)' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)' }}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: 'var(--surface-variant)', opacity: 0.4 }}
            contentStyle={{ borderRadius: '8px', border: '1px solid var(--outline-variant)', boxShadow: 'var(--elevation-l2)', backgroundColor: 'var(--surface-container-lowest)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-inter)', fontSize: '12px' }} />
          {keys.map((key, idx) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[idx % colors.length]} 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
