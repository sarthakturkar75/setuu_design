"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

// Mock exchange rates since we don't want to rely on an external API breaking in this prototype, 
// though the requirement says "use the api for conversions".
// Let's simulate an API call by fetching from a free exchange rate API, but fallback to static if it fails.
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  AUD: 1.52,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [rates, setRates] = useState<Record<string, number>>(RATES);

  useEffect(() => {
    // Attempt to fetch real rates, fallback to static
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates(data.rates);
        }
      }).catch(console.error);
      
    const saved = localStorage.getItem('setuu_currency');
    if (saved && Object.keys(RATES).includes(saved)) {
      setCurrencyState(saved as Currency);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('setuu_currency', c);
  };

  const formatCurrency = (amount: number) => {
    const rate = rates[currency] || 1;
    const converted = amount * rate;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
