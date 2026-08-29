"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function sendChatMessage(
  projectId: string,
  message: string,
  audioUrl?: string,
  mentions?: string[],
  isBroadcast: boolean = false,
  isTransmittal: boolean = false
) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user) return { success: false, error: "Unauthorized" };

  let translatedMessageEs = null;
  if (message) {
    try {
      const groqKey = process.env.GROQ_API_KEY;
      const openAiKey = process.env.OPENAI_API_KEY;
      const apiKey = groqKey || openAiKey;
      const endpoint = groqKey ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const model = groqKey ? "qwen/qwen3.6-27b" : "gpt-4o-mini";

      if (apiKey) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: "Translate to Spanish. Return ONLY the translated text. Construction context." },
              { role: "user", content: message }
            ],
            temperature: 0.3
          })
        });
        if (response.ok) {
          const data = await response.json();
          translatedMessageEs = data.choices[0]?.message?.content?.trim();
        }
      }
    } catch (e) {
      console.error("Translation failed silently", e);
    }
  }

  const { data: chatData, error } = await supabase
    .from("project_communications")
    .insert({
      project_id: projectId,
      sender_id: user.user.id,
      message,
      translated_message_es: translatedMessageEs,
      audio_url: audioUrl || null,
      is_broadcast: isBroadcast,
      is_transmittal: isTransmittal
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  if (mentions && mentions.length > 0 && chatData) {
    const mentionInserts = mentions.map(uid => ({
      communication_id: chatData.id,
      mentioned_user_id: uid
    }));
    await supabase.from("communication_mentions").insert(mentionInserts);
  }

  return { success: true, data: chatData };
}

export async function markMessageRead(communicationId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return { success: false };

  const { error } = await supabase
    .from("communication_reads")
    .insert({
      communication_id: communicationId,
      user_id: user.user.id
    });

  if (error && error.code !== '23505') {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getProjectCommunications(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_communications")
    .select(`
      *,
      mentions:communication_mentions (mentioned_user_id),
      reads:communication_reads (user_id)
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  const senderIds = [...new Set(data.map((m: any) => m.sender_id))];

  let actors: any[] = [];
  let identities: any[] = [];
  let authUsers: any[] = [];

  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const adminClient = await createClient();

      const { data: aData } = await adminClient.from("user_actor").select("id, display_name, role").in("id", senderIds);
      if (aData) actors = aData;

      const { data: iData } = await adminClient.from("user_identity").select("actor_id, full_name, email").in("actor_id", senderIds);
      if (iData) identities = iData;

      const missingIds = senderIds.filter(id => !identities?.find(i => i.actor_id === id) && !actors?.find(a => a.id === id));
      if (missingIds.length > 0) {
        const { data: authData } = await adminClient.auth.admin.listUsers();
        if (authData?.users) authUsers = authData.users;
      }
    }
  } catch (e) {
    console.error("Error fetching user metadata", e);
  }

  return data.map((msg: any) => {
    const actor = actors?.find((a: any) => a.id === msg.sender_id);
    const identity = identities?.find((i: any) => i.actor_id === msg.sender_id);
    const authFallback = authUsers.find((u: any) => u.id === msg.sender_id);
    const fallbackName = authFallback?.user_metadata?.full_name || authFallback?.email || 'System User';

    return {
      ...msg,
      sender: {
        id: msg.sender_id,
        full_name: identity?.full_name || actor?.display_name || fallbackName,
        role: actor?.role || authFallback?.user_metadata?.role || "Member",
        email: identity?.email || authFallback?.email
      }
    };
  });
}

export async function getAcknowledgmentMatrix(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("project_communications")
    .select(`
      id, message, is_transmittal, is_broadcast, created_at,
      reads:communication_reads (user_id)
    `)
    .eq("project_id", projectId)
    .or("is_transmittal.eq.true,is_broadcast.eq.true")
    .order("created_at", { ascending: false });

  let actors: any[] = [];
  let identities: any[] = [];
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const adminClient = await createClient();
      const { data: iData } = await adminClient.from("user_identity").select("actor_id, full_name");
      if (iData) identities = iData;

      const { data: aData } = await adminClient.from("user_actor").select("id, display_name, role").eq("is_active", true);
      if (aData) actors = aData;
    }
  } catch (e) { }

  // Deduplicate members for the matrix columns
  const uniqueMembersMap = new Map();
  const members = actors.reduce((acc, a) => {
    const ident = identities.find(i => i.actor_id === a.id);
    const fullName = ident?.full_name || a.display_name || 'System User';
    const key = `${fullName}_${a.role}`;

    if (!uniqueMembersMap.has(key)) {
      uniqueMembersMap.set(key, true);
      acc.push({
        id: a.id,
        full_name: fullName,
        role: a.role || 'Member'
      });
    }
    return acc;
  }, []);

  return { messages: messages || [], members };
}

export async function resolveSenderMetadata(senderId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) return null;
    const adminClient = await createClient();
    const { data: ident } = await adminClient.from("user_identity").select("full_name").eq("actor_id", senderId).single();
    const { data: actor } = await adminClient.from("user_actor").select("display_name, role").eq("id", senderId).single();

    let fallbackName = "System User";
    let fallbackRole = "Member";

    if (!ident && !actor) {
      const { data: authData } = await adminClient.auth.admin.getUserById(senderId);
      if (authData?.user) {
        fallbackName = authData.user.user_metadata?.full_name || authData.user.email || fallbackName;
        fallbackRole = authData.user.user_metadata?.role || fallbackRole;
      }
    }

    return {
      full_name: ident?.full_name || actor?.display_name || fallbackName,
      role: actor?.role || fallbackRole
    };
  } catch (e) {
    return null;
  }
}
