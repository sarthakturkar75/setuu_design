"use server";


import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "./notificationActions";
import { verifyRole } from "./authUtils";

// 1. Upload Drawing Version (Tasks 1, 6)
export async function uploadDrawingVersion(formData: FormData) {
  await verifyRole(["admin", "pm", "engineer", "vendor"]);
  const { data: user } = await (await createClient()).auth.getUser();

  const supabase = await createClient();

  const projectId = formData.get("project_id") as string;
  const drawingName = formData.get("drawing_name") as string;
  const fileUrl = formData.get("file_url") as string;
  const discipline = formData.get("discipline") as string || "Architectural";
  const scaleFactor = parseFloat(formData.get("scale_factor") as string) || null;

  const { data: existing } = await supabase
    .from("drawing_versions")
    .select("version_number")
    .eq("project_id", projectId)
    .eq("drawing_name", drawingName)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = existing && existing.length > 0 ? (existing[0].version_number || 1) + 1 : 1;

  const { error } = await supabase.from("drawing_versions").insert({
    project_id: projectId,
    drawing_name: drawingName,
    file_url: fileUrl,
    version_number: nextVersion,
    status: "Approved",
    uploaded_by: user?.user?.id,
    custom_data: { discipline, scale_factor: scaleFactor }
  });

  if (error) return { success: false, error: error.message };

  if (!error) {
    const { data: stakeholders } = await supabase.from("user_actor").select("id").in("role", ["admin", "pm", "engineer"]);
    if (stakeholders) {
      const userIds = stakeholders.map(s => s.id).filter(id => id !== user?.user?.id);
      if (userIds.length > 0) {
        const creatorEmail = user?.user?.email || "Someone";
        await createSystemNotification(
          userIds,
          `New Blueprint Revision: ${drawingName}`,
          `${creatorEmail} uploaded revision v${nextVersion} for ${drawingName} (${discipline || "Architectural"}).`,
          "update",
          projectId
        );
      }
    }
  }

  revalidatePath(`/`);
  return { success: true };
}

// Fetch Drawings
export async function getProjectDrawings(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Check granular permissions for this user on this project
    const { data: perms } = await supabase
      .from('project_granular_permissions')
      .select('can_view_drawings')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    const { data: userActor } = await supabase.from('user_actor').select('role').eq('id', user.id).maybeSingle();
    
    // If not an admin/superadmin, and explicit permission is missing or false, DENY.
    if (userActor?.role !== 'admin' && userActor?.role !== 'superadmin' && userActor?.role !== 'pm') {
       if (!perms || perms.can_view_drawings !== true) {
         throw new Error("Access Denied: You do not have permission to view drawings for this project.");
       }
    }
  }

  

  const { data, error } = await supabase
    .from("drawing_versions")
    .select("*, drawing_pins(*), drawing_hyperlinks!drawing_hyperlinks_source_drawing_id_fkey(*)")
    .eq("project_id", projectId)
    .order("drawing_name", { ascending: true })
    .order("version_number", { ascending: false });
  if (error) throw error;
  return data;
}

// 3. Coordinate Pinning (Task 3)
export async function pinEntityToDrawing(drawingId: string, x: number, y: number, entityType: string, entityId: string | null) {
  await verifyRole(["admin", "pm", "engineer"]);
  
  const supabase = await createClient();

  const { error } = await supabase.from("drawing_pins").insert({
    drawing_id: drawingId,
    x_coord: x,
    y_coord: y,
    linked_entity_type: entityType,
    linked_entity_id: entityId
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// 4. Auto-Slip Sheeting (Task 4)
export async function simulateSlipSheeting(projectId: string, pages: any[]) {
  await verifyRole(["admin", "pm"]);
  const { data: user } = await (await createClient()).auth.getUser();

  const supabase = await createClient();

  const inserts = pages.map(page => ({
    project_id: projectId,
    drawing_name: page.extractedTitleBlockName,
    file_url: page.base64Payload,
    version_number: 1,
    status: "Approved",
    uploaded_by: user?.user?.id,
    custom_data: { discipline: "Architectural", source: "Auto-SlipSheet" }
  }));

  const { error } = await supabase.from("drawing_versions").insert(inserts);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// 5. Update Drawing Scale Factor (Takeoff Calibration)
export async function updateDrawingScale(drawingId: string, scaleFactor: number) {
  await verifyRole(["admin", "pm", "engineer"]);
  
  const supabase = await createClient();

  // Fetch current custom_data
  const { data: current } = await supabase.from("drawing_versions").select("custom_data").eq("id", drawingId).single();
  const currentData = current?.custom_data || {};

  const { error } = await supabase.from("drawing_versions").update({
    custom_data: { ...currentData, scale_factor: scaleFactor }
  }).eq("id", drawingId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// --- Task: Drawing Management Utilities ---
export async function deleteDrawingVersion(drawingId: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  
  const { error } = await supabase.from("drawing_versions").delete().eq("id", drawingId);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

export async function renameDrawingGroup(projectId: string, oldName: string, newName: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  
  const { error } = await supabase.from("drawing_versions")
    .update({ drawing_name: newName })
    .eq("project_id", projectId)
    .eq("drawing_name", oldName);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

export async function replaceDrawingFile(drawingId: string, newFileUrl: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  
  const { error } = await supabase.from("drawing_versions")
    .update({ file_url: newFileUrl })
    .eq("id", drawingId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

export async function updateDrawingTags(drawingId: string, customData: any, newTags: string[]) {
  await verifyRole(["admin", "pm", "engineer"]);
  const supabase = await createClient();
  
  const payload = { ...(customData || {}), tags: newTags };
  
  const { error } = await supabase.from("drawing_versions")
    .update({ custom_data: payload })
    .eq("id", drawingId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}
