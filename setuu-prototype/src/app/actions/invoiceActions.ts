"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInvoices(vendorId?: string) {
  const supabase = await createClient();
  let query = supabase.from("invoices").select("*");
  
  if (vendorId) query = query.eq("vendor_id", vendorId);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createInvoice(data: any) {
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/invoices`);
  return { success: true };
}
