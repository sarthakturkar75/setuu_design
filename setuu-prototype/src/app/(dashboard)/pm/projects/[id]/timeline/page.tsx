import { createClient } from "@/lib/supabase/server";
import { ActivityFeed, ActivityItem } from "@/components/ui/ActivityFeed";
import { FilterIcon } from "lucide-react";

export const metadata = {
  title: "Project Timeline | Setuu",
};

export default async function ProjectTimelinePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch project updates
  const { data: updates } = await supabase
    .from("updates")
    .select(`
      id,
      content,
      created_at,
      author:user_actor(identity:user_identity(email)),
      media:media_attachments(id, file_path, file_type)
    `)
    .eq("project_id", params.id)
    .order("created_at", { ascending: false });

  // Map to ActivityItem
  const activityItems: ActivityItem[] = (updates || []).map((u: any) => ({
    id: u.id,
    type: "update",
    content: u.content,
    timestamp: u.created_at,
    author_name: u.author?.identity?.email?.split('@')[0] || "Unknown",
    media: u.media?.map((m: any) => ({
      url: m.file_path, // In a real app this would be a signed URL
      type: m.file_type
    }))
  }));

  return (
    <div className="p-6 max-w-[80rem] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Project Timeline</h1>
          <p className="text-sm text-on-surface-variant font-inter mt-1">Chronological narrative of all field updates and events.</p>
        </div>
        
        <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
          <FilterIcon className="w-4 h-4" />
          Filter
        </button>
      </div>

      <ActivityFeed items={activityItems} />

    </div>
  );
}
