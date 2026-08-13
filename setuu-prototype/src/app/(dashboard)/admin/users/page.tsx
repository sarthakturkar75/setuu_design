import { createClient } from "@/lib/supabase/server";
import { UserDirectoryClient } from "./UserDirectoryClient";

export const metadata = {
  title: "User Directory | Setuu",
};

export default async function UsersPage() {
  const supabase = await createClient();

  // We fetch user_actor and join user_identity and organizations
  const { data: usersData } = await supabase
    .from("user_actor")
    .select(`
      id,
      role,
      is_active,
      user_identity!inner ( full_name, email ),
      organizations ( name )
    `)
    .order("created_at", { ascending: false });

  const users = (usersData || []).map((u: any) => ({
    id: u.id,
    name: u.user_identity?.[0]?.full_name || u.user_identity?.full_name || "Unknown",
    email: u.user_identity?.[0]?.email || u.user_identity?.email || "No Email",
    role: u.role || "unknown",
    organization: u.organizations?.name || "No Organization",
    isActive: u.is_active ?? true,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto w-full pb-20">
      <UserDirectoryClient users={users} />
    </div>
  );
}
