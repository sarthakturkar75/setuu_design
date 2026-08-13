import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default async function ProjectFlagsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  // Fetch flags for this project
  const { data: flagsData } = await supabase
    .from("project_config")
    .select("*")
    .eq("project_id", id);

  // For UI demonstration purposes, define the expected modules
  const ALL_MODULES = [
    { id: "vendor_portal", name: "Vendor Portal", description: "Allow assigned vendors to submit materials and tasks." },
    { id: "client_room", name: "Client Presentation Room", description: "Enable the read-only client dashboard for this project." },
    { id: "financial_tracking", name: "Financial Tracking", description: "Track budgets, invoices, and change request cost impacts." },
  ];

  // Map database config to our modules list
  const configMap = new Map((flagsData || []).map((f: any) => [f.module_name, f.is_enabled]));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Module Flags & Controls</CardTitle>
          <CardDescription>Enable or disable specific features for this project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ALL_MODULES.map((mod) => {
            const isEnabled = configMap.get(mod.id) ?? false;
            return (
              <div key={mod.id} className="flex items-start justify-between py-4 border-b border-outline-variant/50 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-on-surface">{mod.name}</h3>
                  <p className="text-sm text-on-surface-variant font-inter">{mod.description}</p>
                </div>
                {/* Mock toggle for now since we haven't built a Server Action for this yet, but layout is correct */}
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isEnabled ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                  role="switch"
                  aria-checked={isEnabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
