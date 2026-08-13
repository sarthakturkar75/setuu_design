import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, SettingsIcon, SlidersIcon } from "lucide-react";

export default async function ProjectAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <Link 
          href="/admin/projects"
          className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">
            {project.name}
          </h1>
          <p className="text-on-surface-variant font-inter mt-1">
            Project configuration and module settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Project Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <Link
            href={`/admin/projects/${id}/config`}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <SettingsIcon className="w-4 h-4" />
            General Config
          </Link>
          <Link
            href={`/admin/projects/${id}/flags`}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <SlidersIcon className="w-4 h-4" />
            Module Flags
          </Link>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
