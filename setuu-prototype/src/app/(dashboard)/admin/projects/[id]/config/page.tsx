import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectConfigForm } from "@/components/project/ProjectConfigForm";

export default async function ProjectConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProjectConfigForm project={project} />
    </div>
  );
}
