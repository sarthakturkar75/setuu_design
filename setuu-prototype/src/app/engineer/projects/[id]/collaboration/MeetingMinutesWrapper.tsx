"use client";

import { useState } from "react";
import { MeetingMinutesModal } from "@/components/ui/MeetingMinutesModal";

export function MeetingMinutesWrapper({ projectId }: { projectId: string }) {
  const [show, setShow] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setShow(true)}
        className="w-full py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
      >
        Launch Minutes Generator
      </button>
      
      {show && <MeetingMinutesModal projectId={projectId} onClose={() => setShow(false)} />}
    </>
  );
}
