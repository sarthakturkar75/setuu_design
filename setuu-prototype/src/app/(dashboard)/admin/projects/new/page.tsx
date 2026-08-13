import { createClient } from "@/lib/supabase/server";
import { ProjectWizard } from "@/components/project/ProjectWizard";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export const metadata = {
  title: "New Project | Setuu",
};

export default async function NewProjectPage() {
  const supabase = await createClient();

  // Fetch clients
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("type", "client")
    .order("name");

  // Fetch PMs
  const { data: pmData } = await supabase
    .from("user_actor")
    .select("id, display_name")
    .eq("role", "pm")
    .order("display_name");

  const clients = (orgData || []).map((o: any) => ({
    id: o.id,
    name: o.name,
  }));

  const pms = (pmData || []).map((pm: any) => ({
    id: pm.id,
    name: pm.display_name || "Unknown PM",
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      {/* Header section */}
      <div className="space-y-4">
        <Link 
          href="/admin/projects"
          className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Create New Project</h1>
          <p className="text-on-surface-variant font-inter mt-1">
            Initialize a new delivery pipeline and assign key stakeholders.
          </p>
        </div>
      </div>

      {/* Main Wizard */}
      <div className="mt-8">
        <ProjectWizard clients={clients} pms={pms} />
      </div>
    </div>
  );
}
