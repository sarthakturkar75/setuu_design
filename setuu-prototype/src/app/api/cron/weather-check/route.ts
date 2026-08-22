import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup admin bypass client for cron jobs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  // 1. Authenticate CRON
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 2. Fetch all active projects
    const { data: projects } = await supabase.from('projects').select('id, location_lat, location_lng').eq('status', 'Active');
    
    if (!projects) return NextResponse.json({ success: true, message: "No active projects" });

    // 3. Loop through and check weather for each project's coords
    for (const project of projects) {
      if (project.location_lat && project.location_lng) {
         // Call OpenWeatherMap or similar
         const apiKey = process.env.OPENWEATHER_API_KEY;
         if (apiKey) {
           const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${project.location_lat}&lon=${project.location_lng}&appid=${apiKey}`);
           const weatherData = await res.json();
           
           // Determine precipitation (mm)
           const rain = weatherData.rain?.['1h'] || weatherData.rain?.['3h'] || 0;
           
           // Insert into weather_logs
           await supabase.from('weather_logs').insert({
             project_id: project.id,
             date: new Date().toISOString().split('T')[0],
             precipitation_mm: rain,
             delay_triggered: false
           });
         }
      }
    }

    return NextResponse.json({ success: true, message: "Weather telemetry synced" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
