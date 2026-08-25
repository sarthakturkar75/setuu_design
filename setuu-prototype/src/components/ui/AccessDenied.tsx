import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AccessDenied({ returnPath = "/admin" }: { returnPath?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-semantic-crimson/10 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-semantic-crimson" />
      </div>
      <h1 className="text-3xl font-bold font-merriweather text-on-surface mb-2">403 Access Denied</h1>
      <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
        You are not assigned to this project and do not have the required permissions to view or work on it.
      </p>
      <Link 
        href={returnPath}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
