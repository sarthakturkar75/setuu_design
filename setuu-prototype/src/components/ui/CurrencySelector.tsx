"use client";
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  
  return (
    <select 
      value={currency} 
      onChange={e => setCurrency(e.target.value as any)}
      className="bg-surface-container border border-outline rounded p-1 text-xs text-on-surface cursor-pointer"
    >
      <option value="USD">USD ($)</option>
      <option value="EUR">EUR (€)</option>
      <option value="GBP">GBP (£)</option>
      <option value="INR">INR (₹)</option>
      <option value="AUD">AUD (A$)</option>
    </select>
  );
}
