"use client";

import React, { useState } from "react";

interface VoiceWidgetProps {
  onSpeechInput?: (text: string) => void;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({ onSpeechInput }) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Try Chrome/Edge!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (onSpeechInput) {
        onSpeechInput(transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
          Voice Tasks
        </div>
        <h3
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 22,
            fontWeight: 400,
            color: "#1E293B",
            letterSpacing: "-0.02em",
          }}
        >
          Say something to Maestro!
        </h3>
      </div>

      {/* Animated Waveform Visualizer */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
          {[14, 24, 18, 28, 20, 15, 26, 19, 25, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: isListening ? Math.random() * 26 + 6 : h,
                background: "linear-gradient(180deg, #6366F1, #3B82F6)",
                borderRadius: 3,
                transition: "height 150ms ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleListening}
          title="Click to speak task"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: isListening ? "#EF4444" : "#1E293B",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            transition: "all 200ms ease",
          }}
        >
          🎤
        </button>
      </div>
    </div>
  );
};
