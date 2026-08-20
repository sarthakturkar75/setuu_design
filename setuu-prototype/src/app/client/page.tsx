import { PageHeader } from "@/components/ui/PageHeader";

export default function ClientDashboard() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader 
        title="Client Dashboard" 
        subtitle="Welcome to your dashboard"
      />
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-on-surface-variant">More features coming soon.</p>
      </div>
    </div>
  );
}
