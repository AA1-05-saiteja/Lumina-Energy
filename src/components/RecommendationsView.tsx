import React, { useState } from "react";
import { Recommendation } from "../types";

interface RecommendationsViewProps {
  ecoScore: number;
  setEcoScore: (score: number) => void;
  recommendations: Recommendation[];
  onExecuteRecommendation: (id: string) => void;
}

export default function RecommendationsView({
  ecoScore,
  setEcoScore,
  recommendations,
  onExecuteRecommendation,
}: RecommendationsViewProps) {
  const [filterType, setFilterType] = useState<"all" | "HVAC" | "solar" | "schedule">("all");
  const [customSolarKwh, setCustomSolarKwh] = useState<number>(8); // Solar scaling calculator

  // Calculate customized Solar stats based on slider input
  const estimatedSolarRoi = (41.6 / customSolarKwh).toFixed(1);
  const estimatedCost = (customSolarKwh * 75000).toLocaleString('en-IN');

  // Filter recommendations based on tab choices
  const filteredRecs = recommendations.filter((r) => {
    if (filterType === "all") return true;
    if (filterType === "HVAC") return r.title.includes("AC") || r.title.includes("air");
    if (filterType === "solar") return r.title.includes("Solar");
    if (filterType === "schedule") return r.title.includes("Laundry") || r.title.includes("Off-Peak");
    return true;
  });

  // Circle circumference for gauge: r=45 => 282.7. Calculate offsetting
  const offsetValue = 282.7 - (282.7 * ecoScore) / 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-1">
            Sustainability Engine
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-2xl">
            AI-driven actionable insights to optimize your energy footprint and lower operational costs in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-surface-container/60 border border-white/10 text-on-surface hover:text-white hover:border-white/25 transition-all text-xs font-mono py-2 pl-4 pr-10 rounded-full appearance-none cursor-pointer focus:ring-1 focus:ring-primary-fixed focus:outline-none"
            >
              <option value="all">filter: All Categories</option>
              <option value="HVAC">filter: HVAC Systems</option>
              <option value="solar">filter: Solar Systems</option>
              <option value="schedule">filter: Load Shifting</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
              tune
            </span>
          </div>
        </div>
      </header>

      {/* Primary recommendation & Green Energy Score layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Active high-impact optimization card */}
        <div className="md:col-span-8 glass-panel glass-active border-primary/25 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px] ai-pulse-glow">
          {/* Subtle back decor */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap justify-between items-start gap-4 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/25 flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary-fixed">hvac</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-primary-fixed uppercase tracking-widest block font-bold">
                  High Impact Recommendation
                </span>
                <h3 className="font-display text-xl font-bold text-on-surface text-balance">
                  Reduce AC setting by 2 hours tomorrow
                </h3>
              </div>
            </div>

            {/* Application action button */}
            <button
              onClick={() => {
                onExecuteRecommendation("rec-1");
                setEcoScore(Math.min(100, ecoScore + 6));
              }}
              className="bg-primary text-on-primary font-mono text-xs font-bold px-6 py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(193,255,221,0.5)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden"
            >
              Execute Rule
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 z-10 relative">
            <div className="bg-background/40 rounded-xl p-4 border border-white/5 shadow-sm">
              <span className="font-mono text-[9px] text-on-surface-variant block mb-1">Potential Savings</span>
              <div className="font-display text-xl font-bold text-primary-fixed">
                ₹{recommendations.find(r => r.id === "rec-1")?.savings.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '3,400'}<span className="text-xs text-on-surface-variant font-normal font-sans ml-1">/mo</span>
              </div>
            </div>
            <div className="bg-background/40 rounded-xl p-4 border border-white/5 shadow-sm">
              <span className="font-mono text-[9px] text-on-surface-variant block mb-1">Energy Reduction</span>
              <div className="font-display text-xl font-bold text-on-surface">
                120<span className="text-xs text-on-surface-variant font-normal font-sans ml-1"> kWh</span>
              </div>
            </div>
            <div className="bg-background/40 rounded-xl p-4 border border-white/5 shadow-sm">
              <span className="font-mono text-[9px] text-on-surface-variant block mb-1">CO₂ Impact index</span>
              <div className="font-display text-xl font-bold text-primary-fixed">
                -45<span className="text-xs text-on-surface-variant font-normal font-sans ml-1"> lbs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Green Energy Score dial gauge */}
        <div className="md:col-span-4 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4">
            Green Energy Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="#47ffb8"
                strokeWidth="7.5"
                strokeDasharray="283"
                strokeDashoffset={offsetValue}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out-sine drop-shadow-[0_0_8px_rgba(193,255,221,0.5)]"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="font-display text-4xl font-bold text-on-surface">{ecoScore}</span>
              <span className="font-mono text-[10px] text-primary-fixed mt-1 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +5 pts
              </span>
            </div>
          </div>

          <p className="text-on-surface-variant font-sans text-xs max-w-[240px]">
            Your current rating is in the top 15% of energy efficient modular properties.
          </p>
        </div>
      </div>

      {/* Recommendations breakdown timeline & Solar Panel simulator slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Recommendation: Laundry Off-Peak shifting */}
        <div className="glass-panel rounded-2xl p-5 hover:bg-white/5 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-white/10 group-hover:border-primary-fixed/30 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed text-[20px]">
                  local_laundry_service
                </span>
              </div>
              <h3 className="font-display text-[15px] text-on-surface font-bold">
                Shift Laundry to Off-Peak
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 pt-1">
              <div>
                <span className="font-mono text-[9px] text-on-surface-variant block mb-0.5">Est. Savings</span>
                <span className="font-display text-lg font-bold text-primary-fixed">
                  ₹{recommendations.find(r => r.id === "rec-2")?.savings.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '1,440'}<span className="text-[11px] text-on-surface-variant font-normal">/mo</span>
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-on-surface-variant block mb-0.5">Carbon reduction</span>
                <span className="font-display text-lg font-bold text-on-surface">
                  -12<span className="text-[11px] text-on-surface-variant font-normal"> lbs</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-primary-fixed h-full w-[40%] rounded-full shadow-[0_0_8px_rgba(71,255,184,0.5)]" />
            </div>

            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant pt-1 relative">
              <span>Effort: Low</span>
              <button 
                onClick={() => {
                  onExecuteRecommendation("rec-2");
                  setEcoScore(Math.min(100, ecoScore + 3));
                }}
                className="text-primary-fixed hover:-translate-y-0.5 transition-transform"
              >
                + Schedule Shift
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation: Solar Power Scaling Panel Slider */}
        <div className="glass-panel rounded-2xl p-5 hover:bg-white/5 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-white/10 group-hover:border-primary-fixed/30 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed text-[20px]">
                  solar_power
                </span>
              </div>
              <h3 className="font-display text-[15px] text-on-surface font-bold">
                Solar Panel Feasibility
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2 pt-1">
              <div>
                <span className="font-mono text-[9px] text-on-surface-variant block mb-0.5">Est. ROI timeframe</span>
                <span className="font-display text-lg font-bold text-primary-fixed">
                  {estimatedSolarRoi}<span className="text-[11px] text-on-surface-variant font-normal font-sans"> Yrs</span>
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] text-on-surface-variant block mb-0.5">Total System Cost</span>
                <span className="font-display text-lg font-bold text-on-surface">
                  ₹{estimatedCost}
                </span>
              </div>
            </div>

            {/* Slider for PV size */}
            <div className="mt-2 mb-2">
              <span className="font-mono text-[9px] text-on-surface-variant block uppercase mb-1">
                Simulation: Solar Capacity ({customSolarKwh} kW)
              </span>
              <input
                type="range"
                min="4"
                max="20"
                step="2"
                value={customSolarKwh}
                onChange={(e) => setCustomSolarKwh(parseInt(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer h-1.5 rounded-lg bg-surface-container border-0"
              />
            </div>
          </div>

          <div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-primary-fixed h-full rounded-full shadow-[0_0_8px_rgba(71,255,184,0.5)] transition-all" 
                style={{ width: `${(customSolarKwh / 20) * 100}%` }}
              />
            </div>

            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant pt-1">
              <span>Effort: High</span>
              <span>Confidence: 88%</span>
            </div>
          </div>
        </div>

        {/* Environmental metrics chart area */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-[15px] text-on-surface font-bold">
              Carbon Offset Trend
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              info
            </span>
          </div>

          {/* Miniature Area SVG Chart */}
          <div className="w-full h-24 relative rounded-lg overflow-hidden border-b border-primary-fixed/20 bg-gradient-to-t from-primary/5 to-transparent">
            {/* Rule bounds */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              <div className="w-full h-[1px] bg-white/5" />
              <div className="w-full h-[1px] bg-white/5" />
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            {/* SVG Path */}
            <svg className="w-full h-full absolute bottom-0" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,60 Q25,80 50,40 T100,20 L100,100 Z" fill="rgba(71, 255, 184, 0.08)" />
              <path d="M0,60 Q25,80 50,40 T100,20" fill="none" stroke="#47ffb8" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="flex justify-between font-mono text-[9px] text-on-surface-variant pt-2 mt-1">
            <span>Jan (+15)</span>
            <span>Feb (+28)</span>
            <span>Mar (+38)</span>
            <span>Apr (+45)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
