import { Card } from "@/components/ui/Card";
import { AlertTriangle, Clock, FileSignature, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ActionItem {
  id: string;
  title: string;
  type: 'approval' | 'overdue' | 'review';
  priority: 'high' | 'medium' | 'low';
  moduleUrl: string;
  timestamp: string;
}

export function SmartInbox({ items }: { items: ActionItem[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <FileSignature className="w-5 h-5 text-semantic-sky" />;
      case 'overdue': return <Clock className="w-5 h-5 text-semantic-crimson" />;
      case 'review': return <AlertTriangle className="w-5 h-5 text-semantic-amber" />;
      default: return <ArrowRight className="w-5 h-5 text-on-surface-variant" />;
    }
  };

  return (
    <Card className="flex flex-col h-full border-l-4 border-l-semantic-amber">
      <div className="p-4 border-b border-surface-variant/50">
        <h3 className="font-merriweather text-lg font-bold text-on-surface">Action Center</h3>
        <p className="text-sm text-on-surface-variant">Items requiring your immediate attention.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
        {items.length === 0 ? (
          <div className="text-sm text-on-surface-variant text-center py-8">
            You're all caught up! No pending actions.
          </div>
        ) : (
          items.map(item => (
            <Link key={item.id} href={item.moduleUrl} className="block group">
              <div className="flex items-start gap-3 p-3 rounded-md hover:bg-surface-variant/30 transition-colors border border-transparent hover:border-surface-variant/50">
                <div className="mt-0.5">{getIcon(item.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{item.timestamp}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
