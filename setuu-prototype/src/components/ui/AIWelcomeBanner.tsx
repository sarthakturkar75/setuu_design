"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AIWelcomeBannerProps {
  content: string;
}

export function AIWelcomeBanner({ content }: AIWelcomeBannerProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!content) return;
    
    let i = 0;
    setDisplayedText("");
    setIsTyping(true);
    
    const interval = setInterval(() => {
      setDisplayedText(content.substring(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20); // Typing speed

    return () => clearInterval(interval);
  }, [content]);

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 via-surface to-surface border-l-4 border-l-primary relative overflow-hidden">
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-on-surface mb-1">Setuu AI Assistant</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
          </p>
        </div>
      </div>
    </Card>
  );
}
