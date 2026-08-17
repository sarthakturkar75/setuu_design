"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVendors(orgId?: string) {
  const supabase = await createClient();
  let query = supabase.from("org_vendors").select("*, organizations(*)");
  
  if (orgId) query = query.eq("org_id", orgId);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function assignVendorToProject(vendorId: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_vendors")
    .insert({
      vendor_id: vendorId,
      project_id: projectId,
      status: "Active"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${projectId}/config`);
  return { success: true };
}

export async function getVendorPerformance(vendorId: string) {
  const supabase = await createClient();
  // We can query project_vendors and tasks or materials related to this vendor
  // For the prototype, we'll check if they exist in org_vendors and return a base object
  const { data: vendor, error } = await supabase
    .from("org_vendors")
    .select("*")
    .eq("id", vendorId)
    .single();
    
  if (error) throw error;
  
  // Real implementation would calculate based on invoices/materials.
  // For now we map based on vendor type or status for demonstration
  return {
    vendor,
    onTimePercent: vendor.status === "Active" ? 95 : 70,
    avgDelayDays: vendor.status === "Active" ? 1.2 : 5.4,
    complianceStatus: vendor.status === "Active" ? "Compliant" : "Warning",
    totalOrders: 0
  };
}
