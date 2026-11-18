import React from "react";
import { ActiveTab } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  aiPulseActive: boolean;
  setAiPulseActive: (active: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  aiPulseActive,
  setAiPulseActive,
  isMobileOpen = false,
  setIsMobileOpen,
}: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "forecasting", label: "Forecasting", icon: "query_stats" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "recommendations", label: "Recommendations", icon: "auto_awesome" },
    { id: "bill_upload", label: "Bill Upload", icon: "upload_file" },
    { id: "home_setup", label: "Home Setup", icon: "home_work" },
  ] as const;

  const content = (
    <div className="flex h-full flex-col py-6">
      {/* Brand Header */}
      <div className="px-6 pb-6 mb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">bolt</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-primary-fixed tracking-tight">Lumina</h1>
        </div>
        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.15em] ml-11">
          Energy AI
        </p>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all rounded-lg group relative overflow-hidden border-l-4 ${
                isActive
                  ? "bg-primary-fixed/10 text-primary-fixed border-primary-fixed font-semibold"
                  : "text-on-surface-variant border-transparent hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-fixed/10 to-transparent opacity-100 transition-opacity" />
              )}
              <span 
                className="material-symbols-outlined text-[20px]" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-sans text-[15px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer System Toggle & Controls */}
      <div className="px-6 mt-auto pt-6 flex flex-col gap-4">
        {/* Toggleable AI Optimal Pulse */}
        <button
          onClick={() => setAiPulseActive(!aiPulseActive)}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
            aiPulseActive
              ? "bg-primary-fixed/10 border-primary-fixed/30 text-primary-fixed ai-pulse-glow"
              : "bg-surface-bright/40 border-white/5 text-on-surface-variant hover:border-white/10"
          }`}
        >
          <div className="flex items-center gap-3 relative z-10 justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${aiPulseActive ? "bg-primary-fixed animate-pulse" : "bg-on-surface-variant/40"}`} />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {aiPulseActive ? "AI Pulse Active" : "AI Pulse Paused"}
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-primary-fixed opacity-70">
              {aiPulseActive ? "power" : "power_off"}
            </span>
          </div>
        </button>

        <div className="flex flex-col gap-1 -mx-2">
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); setActiveTab("home_setup"); }}
            className="text-on-surface-variant px-3 py-2 flex items-center gap-3 hover:text-on-surface hover:bg-white/5 transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="font-sans">Support settings</span>
          </a>
          <button
            onClick={() => alert("Lumina Energy Intelligence: Logged out gracefully.")}
            className="w-full text-left text-on-surface-variant px-3 py-2 flex items-center gap-3 hover:text-error hover:bg-error/10 transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-sans">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-white/10 bg-surface-container/60 backdrop-blur-2xl shadow-xl flex-col z-40">
        {content}
      </nav>

      {/* Mobile Sidebar Overlay Drawer */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
      />
      <nav 
        className={`fixed top-0 left-0 h-full w-64 border-r border-white/10 bg-surface-container-high/95 backdrop-blur-3xl shadow-2xl z-50 md:hidden transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </nav>
    </>
  );
}
