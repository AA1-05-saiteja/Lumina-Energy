import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, HomeSettings } from "../types";

interface ChatSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  homeSettings: HomeSettings;
  appliancesCount: number;
  ecoScore: number;
}

export default function ChatSidebar({
  isOpen,
  setIsOpen,
  homeSettings,
  appliancesCount,
  ecoScore,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "assistant",
      text: "Hello! I am Lumina, your Home Energy AI. 💡\n\nI can analyze your smart-meter telemetry, recommend pre-cooling adjustments, or audit uploaded bills.\n\n*How can I optimize your household efficiency today?*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const presetSuggestions = [
    "Run HVAC Diagnostic check",
    "How do I save ₹3,000 this month?",
    "Explain my current Eco Score",
  ];

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Build thread context from existing messages (excluding first system prompt)
      const messageHistory = messages
        .filter((m) => m.id !== "init")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          text: m.text,
        }));

      const contextPayload = {
        squareFootage: homeSettings.squareFootage,
        occupants: homeSettings.occupants,
        hasEvCharger: homeSettings.hasEvCharger,
        hasSolarPanels: homeSettings.hasSolarPanels,
        hvacType: homeSettings.hvacType,
        ecoScore,
        appliancesCount,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messageHistory,
          context: contextPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat api failed");
      }

      const resData = await response.json();

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: resData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant network error:", error);
      
      // Fallback offline assistance response mapping
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: "I encountered a minor grid disruption while formulating my reply. Please verify that your system is online and try sending your query again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Lumina Bubble Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-primary-fixed text-on-primary-fixed shadow-[0_0_20px_rgba(71,255,184,0.4)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-55 pointer-events-auto border-2 border-primary-fixed-dim"
        >
          <span className="material-symbols-outlined text-[28px] animate-pulse">
            auto_awesome
          </span>
          {/* Badge indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-mono font-bold text-white">
            1
          </span>
        </button>
      )}

      {/* Slide-out Panel Overlay Backer */}
      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Sidebar Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface-container-high/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-55 flex flex-col transition-transform duration-300 pointer-events-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header toolbar */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-highest/50">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-ping" />
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface">
                Lumina Energy AI
              </h3>
              <p className="font-mono text-[9px] text-[#47ffb8]">
                Grid-Cognitive Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Message Thread container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((m) => {
            const isMe = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed font-sans shadow-sm border ${
                    isMe
                      ? "bg-secondary-container border-secondary/20 text-on-secondary-container rounded-tr-none"
                      : "bg-surface-container-low border-white/5 text-on-surface rounded-tl-none relative overflow-hidden"
                  }`}
                >
                  {/* Message body markdown simulation rendering */}
                  <div className="space-y-1 select-text">
                    {m.text.split("\n\n").map((para, i) => {
                      if (para.startsWith("- ") || para.startsWith("* ")) {
                        const items = para.split("\n");
                        return (
                          <ul key={i} className="list-disc pl-4 space-y-1.5 text-xs text-on-surface">
                            {items.map((item, idy) => {
                              const cleanItem = item.replace(/^[-*]\s*/, "");
                              return <li key={idy} dangerouslySetInnerHTML={{ __html: cleanItem }} />;
                            })}
                          </ul>
                        );
                      }
                      // Robust inline highlights parsing
                      const markedText = para
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>');
                      return <p key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: markedText }} />;
                    })}
                  </div>
                </div>

                <span className="font-mono text-[9px] text-on-surface-variant/40 mt-1 pl-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {/* Assistant formulating/answering fallback indicator */}
          {isSending && (
            <div className="self-start max-w-[80%] flex flex-col">
              <div className="bg-surface-container-low/70 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant">Lumina is optimizing parameters...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion prompt presets */}
        {messages.length === 1 && (
          <div className="p-4 flex flex-col gap-2 bg-surface-container-lowest/30 border-t border-white/5">
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1">
              Active Suggestion chips
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-surface-bright/20 border border-white/5 hover:border-primary-fixed/30 hover:bg-white/5 transition-all text-xs text-on-surface-variant hover:text-on-surface font-sans cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input area */}
        <div className="p-4 border-t border-white/5 bg-surface-container-highest/60 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(inputValue)}
            placeholder="Type a query for Lumina..."
            className="flex-1 bg-surface-container-low border border-white/10 focus:border-primary-fixed/40 focus:ring-1 focus:ring-primary-fixed/30 py-2.5 px-3.5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none"
            disabled={isSending}
          />
          <button
            onClick={() => handleSendPrompt(inputValue)}
            disabled={!inputValue.trim() || isSending}
            className="w-9 h-9 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer shadow-[0_0_10px_rgba(71,255,184,0.15)] font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </aside>
    </>
  );
}
