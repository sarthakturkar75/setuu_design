"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Terminal, Download, Play, Pause, Trash2, Cpu, SignalHigh } from "lucide-react";

const mockLogStream = [
  "[09:12:43.001] INFO  [kernel] Booting SETUU_OS v2.4.1 (build 8a9c2)",
  "[09:12:43.054] INFO  [hardware] Detected primary MCU: STM32H7 at 480MHz",
  "[09:12:43.102] INFO  [can_bus] Initializing CAN1 at 500kbps...",
  "[09:12:43.150] OK    [can_bus] CAN1 transceiver online. Mailboxes configured.",
  "[09:12:44.020] INFO  [sensor_hub] Discovering I2C devices on bus 0...",
  "[09:12:44.025] OK    [sensor_hub] Found IMU at 0x68",
  "[09:12:44.030] OK    [sensor_hub] Found Temp Sensor at 0x4A",
  "[09:12:45.500] WARN  [thermal] Ambient temp reading elevated: 42°C",
  "[09:12:46.100] INFO  [motor_ctrl] Enabling PWM outputs...",
  "[09:12:46.150] OK    [motor_ctrl] PWM active. Duty cycle 0%.",
  "[09:12:48.000] DEBUG [state_machine] Transitioning to ACTIVE_IDLE",
  "[09:12:50.450] ERROR [can_bus] TX error counter exceeded warning threshold (96)",
  "[09:12:51.200] ERROR [can_bus] Packet loss detected on ID 0x1A4",
  "[09:12:52.000] WARN  [safety] Comm latency spike: 12ms (Threshold: 5ms)",
  "[09:12:52.005] FATAL [safety] SAFETY HALT ENGAGED. Disabling PWM.",
  "[09:12:52.010] INFO  [state_machine] Transitioning to FAULT_STATE"
];

export default function MobileLogPeekPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      interval = setInterval(() => {
        if (currentIndex < mockLogStream.length) {
          setLogs(prev => [...prev, mockLogStream[currentIndex]]);
          currentIndex++;
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
          setIsStreaming(false);
          clearInterval(interval);
        }
      }, 800); // Simulate real-time log arrival
    }

    return () => clearInterval(interval);
  }, [isStreaming]);

  const getLogColor = (log: string) => {
    if (log.includes("ERROR") || log.includes("FATAL")) return "text-semantic-crimson font-bold";
    if (log.includes("WARN")) return "text-semantic-amber";
    if (log.includes("OK")) return "text-semantic-emerald";
    if (log.includes("DEBUG")) return "text-semantic-purple";
    return "text-white/80"; // INFO
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#1B1C19]">
      
      {/* Terminal Header */}
      <div className="bg-[#121310] border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 text-semantic-sky" />
          <div>
            <h1 className="font-jetbrains-mono text-sm font-bold text-white">Live Telemetry Stream</h1>
            <div className="flex items-center text-[10px] text-white/50 font-inter mt-0.5">
              <Cpu className="w-3 h-3 mr-1" /> DevKit-Alpha-04
              <span className="mx-2">•</span>
              <SignalHigh className="w-3 h-3 mr-1 text-semantic-emerald" /> Connected (ws://tty)
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsStreaming(!isStreaming)}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setLogs([])}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded bg-semantic-sky/10 hover:bg-semantic-sky/20 text-semantic-sky transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Viewport */}
      <div className="flex-1 overflow-y-auto p-4 font-jetbrains-mono text-xs sm:text-sm leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-white/30 italic">Waiting for incoming telemetry data...</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className={`break-words ${getLogColor(log)} hover:bg-white/5 px-2 py-0.5 rounded transition-colors`}>
                {log}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

    </div>
  );
}
