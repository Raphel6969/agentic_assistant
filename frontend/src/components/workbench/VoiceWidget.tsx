"use client";

import React, { useState, useRef } from "react";

interface VoiceWidgetProps {
  onSpeechInput?: (text: string) => void;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({ onSpeechInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "listening" | "done">("idle");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!(("webkitSpeechRecognition" in window) || ("SpeechRecognition" in window))) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("listening");
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const interim = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setStatus("idle");
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus("done");
      const finalText = transcript;
      if (finalText.trim() && onSpeechInput) {
        onSpeechInput(finalText.trim());
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setStatus("idle");
  };

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        border: "1px solid rgba(255, 255, 255, 0.9)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6366F1",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            Voice Input
          </div>
          <h3
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#0F172A",
              margin: 0,
            }}
          >
            {isListening ? "Listening..." : "Talk to Maestro"}
          </h3>
        </div>

        {/* Mic Button */}
        <button
          onClick={handleButtonClick}
          title={isListening ? "Stop listening" : "Click to speak"}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: isListening
              ? "linear-gradient(135deg, #EF4444, #DC2626)"
              : "linear-gradient(135deg, #6366F1, #4F46E5)",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: isListening
              ? "0 0 0 6px rgba(239,68,68,0.2), 0 4px 14px rgba(239,68,68,0.4)"
              : "0 4px 14px rgba(99,102,241,0.3)",
            transition: "all 250ms ease",
            flexShrink: 0,
          }}
        >
          {isListening ? "⏹" : "🎤"}
        </button>
      </div>

      {/* Waveform bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
        {[8, 16, 22, 12, 28, 18, 24, 14, 20, 10, 26, 16].map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: isListening ? Math.random() * 26 + 6 : h,
              background: isListening
                ? `linear-gradient(180deg, #6366F1, #818CF8)`
                : "rgba(99, 102, 241, 0.25)",
              borderRadius: 4,
              transition: isListening ? `height ${80 + i * 20}ms ease-in-out` : "height 300ms ease",
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      {/* Transcript display */}
      {(transcript || status === "done") && (
        <div
          style={{
            background: "rgba(99, 102, 241, 0.06)",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#1E293B",
            fontStyle: transcript ? "normal" : "italic",
            border: "1px solid rgba(99,102,241,0.15)",
            minHeight: 36,
          }}
        >
          {transcript || (status === "done" && !transcript ? "No speech detected. Try again." : "")}
        </div>
      )}

      {/* Helper text */}
      {status === "idle" && !transcript && (
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
          Press the mic button and speak — Maestro will understand your intent automatically.
        </p>
      )}
    </div>
  );
};
