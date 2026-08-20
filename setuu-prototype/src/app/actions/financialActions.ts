"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCashFlowData() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from("projects").select("start_date, contract_value");
  
  if (error) {
    console.error(error);
    return [];
  }
  
  const monthData: Record<string, { Inflow: number, Outflow: number }> = {};
  
  projects?.forEach(p => {
    if (p.start_date && p.contract_value) {
      const date = new Date(p.start_date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthData[month]) {
        monthData[month] = { Inflow: 0, Outflow: 0 };
      }
      monthData[month].Inflow += Number(p.contract_value) / 1000000;
      monthData[month].Outflow += (Number(p.contract_value) * 0.8) / 1000000;
    }
  });
  
  const result = Object.keys(monthData).map(month => ({
    month,
    Inflow: Math.round(monthData[month].Inflow),
    Outflow: Math.round(monthData[month].Outflow),
  }));

  return result;
}
