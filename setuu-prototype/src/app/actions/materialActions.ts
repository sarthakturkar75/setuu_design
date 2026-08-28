"use server";

import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

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
  
  // Actually deduct from current_stock
  const { data: matData } = await supabase.from("project_materials").select("current_stock").eq("id", materialId).single();
  if (matData && matData.current_stock !== undefined) {
      await supabase.from("project_materials").update({ current_stock: Math.max(0, Number(matData.current_stock) - quantityWasted) }).eq("id", materialId);
      await checkRestockThreshold(materialId);
  }

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
  const submittalId = formData.get("submittal_id") as string;
  const reorderThreshold = parseInt(formData.get("reorder_threshold") as string) || 0;
  const currentStock = parseInt(formData.get("current_stock") as string) || quantity;
  const unitCost = parseFloat(formData.get("unit_cost") as string) || 0;

  const qrUuid = crypto.randomUUID();
  
  const { error } = await supabase.from("project_materials").insert({
    project_id: projectId,
    item_name: itemName,
    qr_uuid: qrUuid,
    current_stock: currentStock,
    reorder_threshold: reorderThreshold,
    unit_cost: unitCost,
    ...(submittalId ? { submittal_id: submittalId } : {}),
    quantity: quantity,
    po_number: poNumber,
    status: "Ordered"
  });
  
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}


export async function checkRestockThreshold(materialId: string) {
  const supabase = await createClient();
  
  // Fetch current material
  const { data: material, error } = await supabase
    .from("project_materials")
    .select("id, project_id, item_name, current_stock, reorder_threshold")
    .eq("id", materialId)
    .single();

  if (error || !material) return { success: false, error: "Material not found or columns missing" };

  // If we breach the threshold, auto-draft a PO
  if (material.reorder_threshold > 0 && material.current_stock < material.reorder_threshold) {
    // Check if a draft PO already exists to avoid duplicates
    const { data: existingPO } = await supabase
      .from("purchase_orders")
      .select("id")
      .eq("material_id", materialId)
      .eq("status", "Draft")
      .single();

    if (!existingPO) {
      // Auto-draft PO
      await supabase.from("purchase_orders").insert({
        project_id: material.project_id,
        material_id: material.id,
        po_number: "AUTO-" + Date.now().toString().slice(-6),
        status: "Draft",
        total_amount: 0 // Will be updated when cost is defined
      });

      // Send a notification to the PM
      const { data: project } = await supabase
        .from("projects")
        .select("assigned_pm_id")
        .eq("id", material.project_id)
        .single();
        
      if (project?.assigned_pm_id) {
         await supabase.from("notifications").insert({
           user_id: project.assigned_pm_id,
           reference_id: material.project_id,
           title: "Auto-Drafted PO",
           body: `Stock for ${material.item_name} fell below threshold (${material.current_stock} < ${material.reorder_threshold}). A draft Purchase Order has been generated.`,
           type: "system",
           is_read: false
         });
      }
      return { success: true, message: "Draft PO created" };
    }
  }
  return { success: true, message: "Stock level OK" };
}

export async function getProjectSubmittals(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("project_submittals").select("id, title, spec_section").eq("project_id", projectId);
  return data || [];
}

export async function uploadDeliveryProof(materialId: string, projectId: string, fileUrl: string, fileType: string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { error } = await supabase.from("delivery_proofs").insert({
    material_id: materialId,
    project_id: projectId,
    file_url: fileUrl,
    file_type: fileType,
    notes,
    uploaded_by: user.id
  });
  if (error) throw error;
  
  await supabase.from("project_materials").update({ status: 'in_transit' }).eq("id", materialId);
  return { success: true };
}
