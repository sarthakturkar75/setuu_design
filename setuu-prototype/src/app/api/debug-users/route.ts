import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  const adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: user_actors } = await adminClient.from('user_actor').select('*');
  const { data: user_identities } = await adminClient.from('user_identity').select('*');
  const { data: users } = await adminClient.auth.admin.listUsers();
  return NextResponse.json({ users: users?.users, user_actors, user_identities });
}
