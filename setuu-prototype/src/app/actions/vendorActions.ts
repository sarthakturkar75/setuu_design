"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVendors(orgId?: string) {
  const supabase = await createClient();
  let query = supabase.from("org_vendors").select("*, organizations(*)");
  
  if (orgId) query = query.eq("org_id", orgId);
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(vendor => ({
    ...vendor,
    organization_name: vendor.organizations && typeof vendor.organizations === 'object' && !Array.isArray(vendor.organizations)
      ? (vendor.organizations as any).name
      : null
  }));
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
  
  const { data: vendor, error } = await supabase
    .from("org_vendors")
    .select("*")
    .eq("id", vendorId)
    .single();
    
  if (error) throw error;
  
  const { data: materials, error: matError } = await supabase
    .from("project_materials")
    .select("status, estimated_delivery, actual_delivery")
    .eq("vendor_id", vendorId);
    
  let onTimePercent = 0;
  let avgDelayDays = 0;
  let totalOrders = 0;
  
  if (!matError && materials && materials.length > 0) {
    totalOrders = materials.length;
    let onTimeCount = 0;
    let totalDelay = 0;
    
    materials.forEach((m: any) => {
      if (m.actual_delivery && m.estimated_delivery) {
        const actual = new Date(m.actual_delivery);
        const est = new Date(m.estimated_delivery);
        const delay = (actual.getTime() - est.getTime()) / (1000 * 3600 * 24);
        
        if (delay <= 0) {
          onTimeCount++;
        } else {
          totalDelay += delay;
        }
      } else if (m.status === 'Delivered') {
         onTimeCount++;
      }
    });
    
    onTimePercent = Math.round((onTimeCount / totalOrders) * 100);
    avgDelayDays = (totalOrders - onTimeCount) > 0 ? parseFloat((totalDelay / (totalOrders - onTimeCount)).toFixed(1)) : 0;
  } else {
    onTimePercent = 0;
    avgDelayDays = 0;
  }
  
  return {
    vendor,
    onTimePercent,
    avgDelayDays,
    complianceStatus: vendor.status === "Active" ? "Compliant" : "Warning",
    totalOrders
  };
}
