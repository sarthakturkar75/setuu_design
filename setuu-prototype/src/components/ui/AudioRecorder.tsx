"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

export function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob, transcript: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsProcessing(true);
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");
          const res = await fetch("/api/collaboration/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
            onRecordingComplete(audioBlob, data.text);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  if (isProcessing) {
    return (
      <button disabled className="p-2 bg-surface-variant text-on-surface-variant rounded-full cursor-not-allowed">
        <Loader2 className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className={`p-2 rounded-full transition-colors ${
        isRecording ? "bg-error text-on-error animate-pulse" : "bg-primary text-on-primary hover:bg-primary/90"
      }`}
      title="Hold to record voice note"
    >
      {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
