"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getCashFlowData() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: userActor } = await supabase.from('user_actor').select('role').eq('id', user.id).maybeSingle();
    if (userActor?.role === 'vendor' || userActor?.role === 'engineer') {
      // Need granular check, but cashflow is global. Deny global cashflow to vendors unless specifically handled.
      // Usually project level financials are protected.
      throw new Error("Access Denied: You do not have permission to view global financials.");
    }
  }

  const { data: invoices, error: invError } = await supabase.from("invoices").select("amount, created_at");
  const { data: pos, error: poError } = await supabase.from("purchase_orders").select("total_amount, created_at");
  
  if (invError || poError) {
    console.error(invError || poError);
    return [];
  }
  
  const monthData: Record<string, { Inflow: number, Outflow: number }> = {};
  
  invoices?.forEach(inv => {
    if (inv.created_at && inv.amount) {
      const date = new Date(inv.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthData[month]) monthData[month] = { Inflow: 0, Outflow: 0 };
      monthData[month].Inflow += Number(inv.amount) / 1000000;
    }
  });

  pos?.forEach(po => {
    if (po.created_at && po.total_amount) {
      const date = new Date(po.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthData[month]) monthData[month] = { Inflow: 0, Outflow: 0 };
      monthData[month].Outflow += Number(po.total_amount) / 1000000;
    }
  });
  
  const result = Object.keys(monthData).map(month => ({
    month,
    Inflow: Math.round(monthData[month].Inflow * 10) / 10,
    Outflow: Math.round(monthData[month].Outflow * 10) / 10,
  }));

  return result;
}
