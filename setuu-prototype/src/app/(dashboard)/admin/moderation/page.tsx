import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { CheckIcon, XIcon, UserIcon, MapPinIcon } from "lucide-react";

export const metadata = {
  title: "Moderation Feed | Setuu",
};

export default async function ModerationPage() {
  const supabase = await createClient();

  // Fetch pending updates
  const { data: updates } = await supabase
    .from("updates")
    .select(`
      id,
      caption,
      weather_conditions,
      created_at,
      status,
      projects(name),
      author:user_actor(display_name)
    `)
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-[100rem] mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Progress Update Moderation</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Review field updates and media before they are published to the Client Portal.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {updates?.map((update: any) => (
          <Card key={update.id} className="break-inside-avoid overflow-hidden border-outline-variant/50 hover:border-primary/30 transition-colors">
            {/* Placeholder for media attachment */}
            <div className="w-full h-48 bg-surface-container flex items-center justify-center border-b border-outline-variant/30 relative">
              <span className="text-on-surface-variant/50 font-medium text-sm">Media Attachment</span>
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-jetbrains-mono">
                {new Date(update.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface text-sm line-clamp-1">{update.projects?.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
                    <UserIcon className="w-3 h-3" />
                    <span>{update.author?.display_name || "Unknown Author"}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <p className="text-sm text-on-surface line-clamp-3">
                {update.caption}
              </p>
              {update.weather_conditions && (
                <div className="mt-3 flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded w-fit border border-outline-variant/30">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{update.weather_conditions}</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-semantic-emerald/10 text-semantic-emerald rounded-md hover:bg-semantic-emerald/20 transition-colors text-xs font-medium">
                <CheckIcon className="w-4 h-4" />
                Approve
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-semantic-crimson/10 text-semantic-crimson rounded-md hover:bg-semantic-crimson/20 transition-colors text-xs font-medium">
                <XIcon className="w-4 h-4" />
                Reject
              </button>
            </CardFooter>
          </Card>
        ))}

        {(!updates || updates.length === 0) && (
          <div className="col-span-full py-20 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30 border-dashed">
            <h3 className="text-lg font-medium text-on-surface">Inbox Zero</h3>
            <p className="text-on-surface-variant mt-1">All field updates have been moderated.</p>
          </div>
        )}
      </div>
    </div>
  );
}
