"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { sendInviteEmail } from "@/lib/email";
import crypto from "crypto";

export async function createInvite(payload: {
  email: string;
  inviteType: 'platform' | 'organization' | 'project';
  roleOffered: string;
  resourceId?: string; // project_id or org_id
  orgName?: string; // used when superadmin invites admin to create a new org
}) {
  const supabase = await createClient();
  const serviceClient = await createServiceRoleClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get inviter details
  const { data: inviterActor } = await supabase.from('user_actor').select('display_name, role, organization_id').eq('id', user.id).single();
  const inviterName = inviterActor?.display_name || 'Setuu User';
  const inviterRole = inviterActor?.role || 'admin';

  let targetName = "the platform";
  let targetOrgId = inviterActor?.organization_id;
  let targetResourceId = payload.resourceId;

  // Validate logic
  if (inviterRole === 'superadmin' && payload.roleOffered === 'admin') {
    // Creating a new organization for this admin
    if (!payload.orgName) throw new Error("Organization name is required to invite an admin");
    const { data: org, error: orgError } = await serviceClient.from('organizations').insert({
      name: payload.orgName,
      type: 'General',
      settings: {}
    }).select('id').single();
    if (orgError) throw new Error("Failed to create org: " + orgError.message);
    targetOrgId = org.id;
    targetName = payload.orgName;
    targetResourceId = org.id;
  } else if (payload.inviteType === 'project') {
    const { data: proj } = await serviceClient.from('projects').select('name').eq('id', payload.resourceId).single();
    targetName = proj?.name || "a project";
  } else if (payload.inviteType === 'organization') {
    const { data: org } = await serviceClient.from('organizations').select('name').eq('id', targetOrgId).single();
    targetName = org?.name || "an organization";
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const { data: invite, error } = await serviceClient.from('invitations').insert({
    email: payload.email,
    inviter_id: user.id,
    target_org_id: targetOrgId,
    invite_type: payload.inviteType,
    role_offered: payload.roleOffered,
    resource_id: targetResourceId,
    token,
    expires_at: expiresAt.toISOString(),
    metadata: { orgName: payload.orgName }
  }).select().single();

  if (error) throw new Error("Failed to create invite: " + error.message);

  // Determine base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const inviteUrl = `${baseUrl}/invite/accept?token=${token}`;

  // Send Email
  const emailRes = await sendInviteEmail(payload.email, inviterName, payload.roleOffered, targetName, inviteUrl);
  
  return { success: true, inviteUrl, emailSent: emailRes.success };
}

export async function validateInviteToken(token: string) {
  const serviceClient = await createServiceRoleClient();
  const { data: invite, error } = await serviceClient
    .from('invitations')
    .select('*, inviter:user_actor!invitations_inviter_id_fkey(display_name)')
    .eq('token', token)
    .single();

  if (error || !invite) return { valid: false, error: "Invalid token" };
  if (invite.status !== 'pending') return { valid: false, error: "Invitation already processed" };
  if (new Date(invite.expires_at) < new Date()) return { valid: false, error: "Invitation expired" };

  let targetName = "the platform";
  if (invite.invite_type === 'project') {
    const { data: proj } = await serviceClient.from('projects').select('name').eq('id', invite.resource_id).single();
    targetName = proj?.name || "a project";
  } else if (invite.invite_type === 'organization' || invite.target_org_id) {
    const { data: org } = await serviceClient.from('organizations').select('name').eq('id', invite.target_org_id).single();
    targetName = org?.name || invite.metadata?.orgName || "an organization";
  }

  return { 
    valid: true, 
    invite: {
      ...invite,
      inviterName: invite.inviter?.display_name || "A user",
      targetName
    } 
  };
}

export async function acceptInvite(token: string, userId: string) {
  const serviceClient = await createServiceRoleClient();
  
  const { valid, invite, error } = await validateInviteToken(token);
  if (!valid || !invite) throw new Error(error || "Invalid invite");

  // Get user details
  const { data: userAuth, error: userError } = await serviceClient.auth.admin.getUserById(userId);
  if (userError) throw new Error("User not found");

  // Check if user_actor exists
  const { data: actor } = await serviceClient.from('user_actor').select('id').eq('id', userId).single();
  
  // Handle dynamic Organization Creation (Superadmin inviting an Admin)
  let finalOrgId = invite.target_org_id;
  if (!finalOrgId && invite.invite_type === 'organization' && invite.metadata?.orgName) {
    const { data: newOrg, error: orgError } = await serviceClient.from('organizations').insert({
      name: invite.metadata.orgName,
      type: 'client', // Defaulting to client, can be updated later
      status: 'Active'
    }).select('id').single();
    
    if (orgError) throw new Error("Failed to provision new organization");
    finalOrgId = newOrg.id;
  }

  if (!actor) {
    // Create actor
    await serviceClient.from('user_actor').insert({
      id: userId,
      role: invite.role_offered,
      organization_id: finalOrgId,
      display_name: userAuth.user.user_metadata?.full_name || invite.email.split('@')[0],
      is_active: true
    });
    await serviceClient.from('user_identity').insert({
      actor_id: userId,
      email: invite.email,
      full_name: userAuth.user.user_metadata?.full_name || invite.email.split('@')[0]
    });
  }

  // Handle Project assignment
  if (invite.invite_type === 'project' && invite.resource_id) {
    // We use project_vendors as the team mapping table
    await serviceClient.from('project_vendors').insert({
      project_id: invite.resource_id,
      vendor_id: userId
    });
  }

  // Mark invite accepted
  await serviceClient.from('invitations').update({
    status: 'accepted',
    target_user_id: userId
  }).eq('id', invite.id);

  return { success: true };
}
