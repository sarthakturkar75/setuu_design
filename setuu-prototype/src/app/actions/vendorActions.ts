"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function getVendors(orgId?: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  let query = supabase.from("org_vendors").select(`
    id,
    organization_id,
    vendor_id,
    created_at,
    client:organizations!organization_id (
      name
    ),
    vendor:organizations!vendor_id (
      name,
      type,
      status
    )
  `);
  
  if (orgId) query = query.eq("organization_id", orgId);
  
  const { data, error } = await query;
  if (error) throw error;
  
  const vendors = await Promise.all(data.map(async (vendor: any) => {
    let slaScore = 100; // Start at 100% SLA if no data
    try {
      // Small optimization: we only need onTimePercent
      const { data: materials } = await supabase.from("project_materials").select("status, estimated_delivery, actual_delivery").eq("vendor_id", vendor.id);
      if (materials && materials.length > 0) {
        let onTimeCount = 0;
        materials.forEach((m: any) => {
          if (m.actual_delivery && m.estimated_delivery) {
            const actual = new Date(m.actual_delivery);
            const est = new Date(m.estimated_delivery);
            if (actual.getTime() <= est.getTime()) onTimeCount++;
          } else if (m.status === 'Delivered') {
            onTimeCount++;
          }
        });
        slaScore = Math.round((onTimeCount / materials.length) * 100);
      }
    } catch (e) { console.error(e); }

    return {
      ...vendor,
      organization_name: vendor.client?.name || "Platform",
      name: vendor.vendor?.name || "Unknown",
      category: vendor.vendor?.type || "vendor",
      status: vendor.vendor?.status || "active",
      sla: slaScore.toString()
    };
  }));
  return vendors;
}

export async function getVendorCategoryData() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const vendors = await getVendors();
  const counts: Record<string, number> = {};
  
  vendors.forEach(v => {
    counts[v.category] = (counts[v.category] || 0) + 1;
  });
  
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

export async function assignVendorToProject(vendorId: string, projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
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
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
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

export async function getVendorSlaData() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const vendors = await getVendors();
  const result = [];
  
  for (const v of vendors) {
    try {
      const perf = await getVendorPerformance(v.id);
      result.push({
        name: v.name,
        score: perf.onTimePercent > 0 ? perf.onTimePercent : 0
      });
    } catch (e) {
      console.error(e);
      result.push({ name: v.name, score: 0 });
    }
  }
  
  return result.sort((a, b) => b.score - a.score).slice(0, 5);
}

export async function getVendorScorecardData() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const vendors = await getVendors();
  let totalOnTime = 0;
  let count = 0;
  
  for (const v of vendors) {
    try {
      const perf = await getVendorPerformance(v.id);
      if (perf.totalOrders > 0) {
        totalOnTime += perf.onTimePercent;
        count++;
      }
    } catch (e) { console.error(e); }
  }
  
  const avgOnTime = count > 0 ? Math.round(totalOnTime / count) : 0;
  
  // Quality & Compliance
  let qualityScore = 100;
  try {
    const { count: issueCount } = await supabase
      .from('project_issues')
      .select('*', { count: 'exact', head: true })
      .not('responsible_vendor_id', 'is', null);
      
    const { count: materialCount } = await supabase
      .from('project_materials')
      .select('*', { count: 'exact', head: true });
      
    if (materialCount && issueCount && materialCount > 0) {
      qualityScore = Math.max(0, 100 - Math.round((issueCount / materialCount) * 100));
    }
  } catch (e) { console.error(e); }

  // Safety Record
  let safetyScore = 100;
  try {
    const { count: safetyIssues } = await supabase
      .from('project_issues')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'safety')
      .not('responsible_vendor_id', 'is', null);
      
    if (safetyIssues) {
      safetyScore = Math.max(0, 100 - (safetyIssues * 2)); // Subtract points for each issue
    }
  } catch(e) { console.error(e); }
  
  // Cost Variance
  let costScore = 100;
  try {
    const { data: materials } = await supabase
      .from('project_materials')
      .select('actual_cost, estimated_cost')
      .not('actual_cost', 'is', null)
      .not('estimated_cost', 'is', null);
      
    if (materials && materials.length > 0) {
      let totalEst = 0;
      let totalAct = 0;
      materials.forEach(m => {
        totalEst += Number(m.estimated_cost) || 0;
        totalAct += Number(m.actual_cost) || 0;
      });
      if (totalEst > 0) {
        const variance = (totalAct - totalEst) / totalEst;
        costScore = Math.max(0, 100 - Math.max(0, Math.round(variance * 100)));
      }
    }
  } catch(e) { console.error(e); }
  
  return [
    { metric: "Delivery Timeliness", score: avgOnTime, trend: "+2.1%" },
    { metric: "Quality & Compliance", score: qualityScore, trend: "+0.5%" },
    { metric: "Safety Record", score: safetyScore, trend: "0.0%" },
    { metric: "Cost Variance", score: costScore, trend: "-4.2%" },
  ];
}

export async function getVendorDeliveries(vendorId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_materials")
    .select("*, delivery_proofs(*)")
    .eq("vendor_id", vendorId);
    
  if (error) throw error;
  return data;
}

export async function getVendorDefects(vendorId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_issues")
    .select("*")
    .eq("responsible_vendor_id", vendorId);
    
  if (error) throw error;
  return data;
}

export async function getVendorOrders(vendorId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("*")
    .eq("vendor_id", vendorId);
    
  if (error) throw error;
  return data;
}

export async function submitDeliveryProof(materialId: string, proofUrl: string, notes: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { error } = await supabase
    .from("delivery_proofs")
    .insert({
      material_id: materialId,
      proof_url: proofUrl,
      notes: notes,
      status: 'submitted'
    });
    
  if (error) throw error;
  return { success: true };
}
