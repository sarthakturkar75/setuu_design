"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function getInvoices(vendorId?: string) {
  const supabase = await createClient();
  let query = supabase.from("invoices").select("*, vendor:organizations!invoices_vendor_id_fkey(name), project:projects!invoices_project_id_fkey(name)");
  
  if (vendorId) query = query.eq("vendor_id", vendorId);
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(inv => ({
    ...inv,
    vendor_name: inv.vendor && typeof inv.vendor === 'object' && !Array.isArray(inv.vendor) ? (inv.vendor as any).name : "Unknown Vendor",
    project_name: inv.project && typeof inv.project === 'object' && !Array.isArray(inv.project) ? (inv.project as any).name : "Unknown Project"
  }));
}

export async function createInvoice(data: any) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .insert({
      ...data,
      status: "Submitted"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/vendor/invoices`);
  return { success: true };
}

export async function updateInvoiceStatus(id: string, status: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/invoices`);
  return { success: true };
}
