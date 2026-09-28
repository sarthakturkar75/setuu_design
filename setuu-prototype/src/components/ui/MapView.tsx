"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  className?: string;
  locations?: Array<{ id: string; lat: number; lng: number; title: string }>;
}

export function MapView({ className, locations = [] }: MapViewProps) {
  return (
    <div className={cn("relative w-full h-full min-h-[300px] rounded-xl overflow-hidden glass flex items-center justify-center", className)}>
      {/* Placeholder for actual map integration (e.g. Mapbox/Google Maps) */}
      <div className="absolute inset-0 bg-surface-container opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="relative z-10 flex flex-col items-center p-6 text-center">
        <MapPin className="w-12 h-12 text-semantic-sky mb-4 opacity-80" />
        <h3 className="text-lg font-bold font-sans text-on-surface">Geospatial Distribution</h3>
        <p className="text-sm font-sans text-on-surface-variant max-w-sm mt-2">
          Map integration pending. This view will plot {locations.length > 0 ? locations.length : 'all active'} project locations and material transits.
        </p>
      </div>
    </div>
  );
}
