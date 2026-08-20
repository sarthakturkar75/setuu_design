import { PageHeader } from "@/components/ui/PageHeader";

export default function EngineerFeature() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader 
        title="Engineer Feature" 
        subtitle="Under Construction"
      />
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-on-surface-variant">This section is currently under development.</p>
      </div>
    </div>
  );
}
