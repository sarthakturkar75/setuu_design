"use client";

import { Share2, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { generatePublicShareLink } from "@/app/actions/publicShareActions";

export function PublicShareButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      setLoading(true);
      const token = await generatePublicShareLink(projectId, 7);
      const url = `${window.location.origin}/public/project/${token}`;
      
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to generate link:", error);
      alert("Failed to generate public link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleShare}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm hover:brightness-110 transition-all shadow-glow whitespace-nowrap disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      {copied ? "Link Copied!" : "Generate Live Link"}
    </button>
  );
}
