import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SettingsIcon, SaveIcon } from "lucide-react";

export const metadata = {
  title: "Admin Settings | Setuu",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("*")
    .order("setting_key", { ascending: true });

  const settingsMap = (settings || []).reduce((acc: any, curr: any) => {
    acc[curr.setting_key] = curr.setting_value;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Organization Configuration</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Manage global platform settings, default behaviors, and organizational preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <CardTitle>General Preferences</CardTitle>
            </div>
            <CardDescription>Configure core system behaviors and defaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface">Organization Name</label>
                  <input 
                    type="text"
                    defaultValue={settingsMap["org_name"] || "Praimo Global"}
                    className="w-full bg-surface rounded-md border border-outline-variant p-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface">Default Currency</label>
                  <select 
                    defaultValue={settingsMap["default_currency"] || "USD"}
                    className="w-full bg-surface rounded-md border border-outline-variant p-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface">Timezone</label>
                  <select 
                    defaultValue={settingsMap["timezone"] || "UTC"}
                    className="w-full bg-surface rounded-md border border-outline-variant p-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                    <option value="America/New_York">EST (Eastern Standard Time)</option>
                    <option value="Europe/London">GMT (Greenwich Mean Time)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface">Session Timeout (Minutes)</label>
                  <input 
                    type="number"
                    defaultValue={settingsMap["session_timeout"] || "60"}
                    className="w-full bg-surface rounded-md border border-outline-variant p-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary font-jetbrains-mono"
                  />
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6 flex justify-end">
                <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary text-sm font-medium rounded hover:bg-primary/90 transition-colors">
                  <SaveIcon className="w-4 h-4" />
                  Save Configuration
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
