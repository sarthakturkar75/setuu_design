"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getCalendarEvents } from "@/app/actions/projectActions";
import { AlertCircle, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            try {
                const allEvents = await getCalendarEvents();
                setEvents(allEvents);
            } catch (error) {
                console.error("Failed to load calendar events", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchEvents();
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getEventsForDay = (day: number) => {
        return events.filter(e => e.date.getDate() === day && e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear());
    };

    // Make SSR safe for rolePath
    const [rolePath, setRolePath] = useState("admin");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setRolePath(window.location.pathname.startsWith('/pm') ? 'pm' : 'admin');
        }
    }, []);

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <PageHeader 
                title="Global Calendar" 
                subtitle="View all upcoming project milestones and team schedules"
                breadcrumb={
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Link href={`/${rolePath}`} className="hover:text-primary transition-colors">{rolePath === 'pm' ? 'PM' : 'Admin'}</Link>
                        <span>/</span>
                        <span className="text-on-surface font-medium">Calendar</span>
                    </div>
                }
            />
            
            <Card className="p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold font-merriweather text-on-surface">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-on-surface"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-on-surface">Today</button>
                        <button onClick={nextMonth} className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-on-surface"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-on-surface-variant animate-pulse">Loading calendar events...</div>
                ) : (
                    <div className="grid grid-cols-7 gap-px bg-outline-variant/30 rounded-xl overflow-hidden border border-outline-variant/30">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-surface-variant/30 p-3 text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                        
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-surface/50 min-h-[120px]" />
                        ))}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            return (
                                <div key={day} className={`bg-surface min-h-[120px] p-2 border-t border-l border-outline-variant/10 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-2 ${isToday(day) ? 'bg-primary text-white' : 'text-on-surface-variant'}`}>
                                        {day}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {dayEvents.map(event => (
                                            <div key={event.id} className={`px-2 py-1.5 rounded text-xs font-medium truncate ${event.type === 'milestone' ? 'bg-semantic-emerald/10 text-semantic-emerald-on border border-semantic-emerald/20' : 
                                               event.type === 'issue' ? 'bg-semantic-crimson/10 text-semantic-crimson-on border border-semantic-crimson/20' :
                                               event.type === 'update' ? 'bg-semantic-purple/10 text-semantic-purple-on border border-semantic-purple/20' :
                                               'bg-semantic-blue/10 text-semantic-blue-on border border-semantic-blue/20'}`}>
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    {event.type === 'milestone' ? <CheckCircle className="w-3 h-3 shrink-0" /> : 
                                                     event.type === 'update' ? <Camera className="w-3 h-3 shrink-0" /> : 
                                                     event.type === 'issue' ? <AlertCircle className="w-3 h-3 shrink-0" /> :
                                                     <Clock className="w-3 h-3 shrink-0" />}
                                                    <span className="truncate">{event.title}</span>
                                                </div>
                                                <div className="text-[10px] opacity-80 truncate">{event.project || 'Global'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
