import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  GitPullRequest, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Clock
} from "lucide-react";

const reviews = [
  {
    id: "REV-204",
    title: "Firmware v1.2: Motor Safety Halt Routine",
    type: "Software PR",
    author: "Jane Smith",
    submitted: "2 hours ago",
    status: "pending",
    description: "Added the 5ms interrupt latency check before deploying the primary safety halt command to the main bus.",
  },
  {
    id: "REV-205",
    title: "Enclosure IP67 Seal Geometry",
    type: "Mechanical CAD",
    author: "Robert Chen",
    submitted: "5 hours ago",
    status: "pending",
    description: "Updated the flange thickness to 2.4mm to accommodate the new rubber gasket tolerances.",
  },
  {
    id: "REV-201",
    title: "Sensor Array Netlist Validation",
    type: "Electrical Schematic",
    author: "Ali Rahman",
    submitted: "1 day ago",
    status: "changes_requested",
    description: "Please verify that the ground plane separation is sufficient between the analog and digital sections.",
  }
];

export default function PeerReviewsPage() {
  const getIcon = (type: string) => {
    if (type.includes("Software")) return <GitPullRequest className="w-5 h-5 text-semantic-sky" />;
    if (type.includes("Mechanical")) return <Settings className="w-5 h-5 text-semantic-amber" />;
    if (type.includes("Electrical")) return <Cpu className="w-5 h-5 text-semantic-emerald" />;
    return null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-merriweather text-2xl font-bold text-on-surface">Peer Review Queue</h1>
          <p className="text-on-surface-variant text-sm mt-1">Pending approvals for cross-disciplinary engineering assets.</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge tone="slate" label={`Total: ${reviews.length}`} />
          <StatusBadge tone="purple" label={`Pending: ${reviews.filter(r => r.status === 'pending').length}`} />
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-surface-container p-2 rounded-lg">
                  {getIcon(review.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-jetbrains-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {review.id}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded">
                      {review.type}
                    </span>
                    {review.status === "changes_requested" && (
                      <span className="text-xs font-medium text-semantic-amber bg-semantic-amber/10 px-2 py-0.5 rounded flex items-center">
                        <XCircle className="w-3 h-3 mr-1" /> Changes Requested
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold font-inter text-on-surface">
                    {review.title}
                  </CardTitle>
                </div>
              </div>
              <div className="text-sm text-on-surface-variant flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/30">
                <Clock className="w-4 h-4 mr-2" />
                {review.submitted}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-on-surface-variant text-sm border-l-2 border-outline-variant pl-4 py-1 italic">
                "{review.description}"
              </p>
              <div className="mt-4 text-xs font-medium text-on-surface-variant flex items-center">
                <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center mr-2 text-[10px] text-on-surface">
                  {review.author.split(' ').map(n => n[0]).join('')}
                </span>
                Submitted by {review.author}
              </div>
            </CardContent>
            <CardFooter className="bg-surface-container-lowest border-t border-outline-variant/30 px-6 py-3 flex justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment
              </button>
              <button className="px-4 py-2 text-sm font-medium text-semantic-amber hover:bg-semantic-amber/10 rounded-lg transition-colors flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Request Changes
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
