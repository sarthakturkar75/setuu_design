"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

// 1. Fetch Materials and Locations
export async function getProjectMaterials(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_materials")
    .select("*, site_locations(*)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSiteLocations(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_locations")
    .select("*")
    .eq("project_id", projectId);
    
  if (error) throw error;
  return data;
}

// 1b. Assign Laydown Yard Zone
export async function assignMaterialLocation(materialId: string, locationId: string) {
  await verifyRole(["admin", "pm", "vendor"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .update({ location_id: locationId })
    .eq("id", materialId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// 2. Barcode/QR Scanning
export async function scanMaterial(qrUuid: string) {
  const supabase = await createClient();
  
  // Find material
  const { data: material } = await supabase
    .from("project_materials")
    .select("id, project_id, status")
    .eq("qr_uuid", qrUuid)
    .single();

  if (!material) return { success: false, error: "Invalid QR Code" };

  // Update Status to On Site
  const { error } = await supabase
    .from("project_materials")
    .update({ status: "On Site" })
    .eq("id", material.id);

  if (error) return { success: false, error: error.message };
  
  revalidatePath(`/`);
  return { success: true, materialId: material.id, projectId: material.project_id };
}

// 3. Split-Deliveries Logging
export async function logSplitDelivery(materialId: string, quantity: number, date: string) {
  await verifyRole(["admin", "pm", "vendor"]);
  const supabase = await createClient();
  
  const { data: material } = await supabase.from("project_materials").select("custom_data").eq("id", materialId).single();
  if (!material) return { success: false, error: "Not found" };

  const existingData = (material.custom_data as any) || {};
  const splitDeliveries = existingData.split_deliveries || [];
  
  splitDeliveries.push({ quantity, date, logged_at: new Date().toISOString() });

  const { error } = await supabase
    .from("project_materials")
    .update({ 
      custom_data: { ...existingData, split_deliveries: splitDeliveries } 
    })
    .eq("id", materialId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// 6. Waste & Scrap Tracking
export async function logMaterialWaste(materialId: string, quantityWasted: number, reason: string, unitCost: number) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  
  const financialLoss = quantityWasted * unitCost;

  const { error } = await supabase.from("material_waste_logs").insert({
    material_id: materialId,
    quantity_wasted: quantityWasted,
    reason: reason,
    financial_loss: financialLoss,
    logged_at: new Date().toISOString()
  });

  if (error) return { success: false, error: error.message };
  
  // Deduct from total material quantity (optional physical sync, but for tracking we leave it and just sum loss)
  revalidatePath(`/`);
  return { success: true };
}

// 6b. Waste Analytics
export async function getWasteAnalytics(projectId: string) {
  const supabase = await createClient();
  
  // Subquery simulation: get all materials for project, then their waste logs
  const { data: materials } = await supabase.from("project_materials").select("id").eq("project_id", projectId);
  if (!materials || materials.length === 0) return { totalLoss: 0, incidents: 0 };

  const materialIds = materials.map(m => m.id);
  const { data: wasteLogs } = await supabase.from("material_waste_logs").select("financial_loss").in("material_id", materialIds);

  const totalLoss = (wasteLogs || []).reduce((acc, log) => acc + (log.financial_loss || 0), 0);
  
  return {
    totalLoss,
    incidents: (wasteLogs || []).length
  };
}

// Legacy functions for global list pages
export async function getMaterials() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_materials").select("*, projects(name)").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createMaterial(formData: FormData) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const projectId = formData.get("project_id") as string;
  const itemName = formData.get("item_name") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 0;
  const poNumber = formData.get("po_number") as string;
  
  const { error } = await supabase.from("project_materials").insert({
    project_id: projectId,
    item_name: itemName,
    quantity: quantity,
    po_number: poNumber,
    status: "Ordered"
  });
  
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}
