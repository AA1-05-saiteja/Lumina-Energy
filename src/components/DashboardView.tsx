import React, { useState } from "react";
import { ApplianceMetric, Recommendation } from "../types";

interface DashboardViewProps {
  ecoScore: number;
  setEcoScore: (score: number) => void;
  aiPulseActive: boolean;
  onExecuteRecommendation: (id: string) => void;
  appliances: ApplianceMetric[];
}

export default function DashboardView({
  ecoScore,
  setEcoScore,
  aiPulseActive,
  onExecuteRecommendation,
  appliances,
}: DashboardViewProps) {
  const [chartRange, setChartRange] = useState<"14D" | "30D">("14D");
  const [optimizationStatus, setOptimizationStatus] = useState<"paused" | "active" | "overridden">("active");

  // Chart data points matching range selections
  const d14Points = "0,65 10,50 20,70 30,40 40,30 50,45 60,80 70,50 80,35 90,20 100,40";
  const d30Points = "0,80 8,65 16,75 24,55 32,45 40,60 48,50 56,70 64,40 72,30 80,45 88,35 96,20 100,30";

  const d14AreaPoints = "0,100 0,65 10,50 20,70 30,40 40,30 50,45 60,80 70,50 80,35 90,20 100,40 100,100";
  const d30AreaPoints = "0,100 0,80 8,65 16,75 24,55 32,45 40,60 48,50 56,70 64,40 72,30 80,45 88,35 96,20 100,30 100,100";

  const activePoints = chartRange === "14D" ? d14Points : d30Points;
  const activeAreaPoints = chartRange === "14D" ? d14AreaPoints : d30AreaPoints;

  // Selected hover state item representation
  const hoverX = chartRange === "14D" ? 90 : 96;
  const hoverY = chartRange === "14D" ? 20 : 20;
  const hoverKw = chartRange === "14D" ? "54.2" : "51.8";

  // Calculate percentage of dash offsetting for the gauge loader circular path
  // total length = 282.7 (radius = 45 * 2 * PI = 282.7)
  const circularProgressOffset = 282.7 - (282.7 * ecoScore) / 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading & Time Stamp */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-1">
            Overview
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            Real-time telemetry and predictive models for your home.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-ping opacity-75" />
          <span className="font-mono text-xs text-on-surface-variant font-medium">
            Live Sync: Just now
          </span>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Current Consumption */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/20">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">bolt</span> 
              Current Usage
            </span>
            <span className="material-symbols-outlined text-primary-fixed text-opacity-50">
              trending_down
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-on-surface">
                842
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                kWh
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-primary-fixed font-bold">-4.2%</span>{" "}
              <span className="text-on-surface-variant text-xs">vs last month</span>
            </div>
          </div>
          {/* Subtle Background Icon glow */}
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
        </div>

        {/* Card 2: Predicted Next */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/20">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">analytics</span> 
              Predicted Next
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-on-surface">
                910
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                kWh
              </span>
            </div>
            <div className="mt-2 text-sm flex items-center gap-1">
              <span className="text-error font-semibold flex items-center gap-0.5 text-xs">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 
                +8.0%
              </span>
              <span className="text-on-surface-variant text-xs truncate">
                Weather adjustment
              </span>
            </div>
          </div>
          {/* Sparkline Visual Simulation */}
          <div className="absolute bottom-0 left-0 right-0 h-8 opacity-25 flex items-end px-2 pb-2 gap-1">
            <div className="w-full bg-surface-bright h-1 rounded-t-sm" />
            <div className="w-full bg-surface-bright h-2.5 rounded-t-sm" />
            <div className="w-full bg-surface-bright h-1 rounded-t-sm" />
            <div className="w-full bg-surface-bright h-4 rounded-t-sm" />
            <div className="w-full bg-error/50 h-5 rounded-t-sm" />
            <div className="w-full bg-error/70 h-7 rounded-t-sm" />
          </div>
        </div>

        {/* Card 3: Carbon Footprint */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group transition-all hover:border-white/20">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#47ffb8]">co2</span> 
              Footprint
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-on-surface">
                342
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                kg CO₂
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-primary-fixed font-semibold">-12%</span>{" "}
              <span className="text-on-surface-variant text-xs">below neighborhood avg</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-green-400">
              eco
            </span>
          </div>
        </div>

        {/* Card 4: AI Savings YTD */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ai-pulse-glow bg-primary-fixed/5 border-primary-fixed/20 transition-all hover:border-primary-fixed/45 group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-mono text-xs text-primary-fixed uppercase tracking-widest flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed animate-spin" style={{ animationDuration: "12s" }}>savings</span> 
              AI Savings YTD
            </span>
            <span className="material-symbols-outlined text-primary-fixed animate-pulse">
              auto_awesome
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-[14px] text-primary-fixed mr-1 font-bold">
                ₹
              </span>
              <span className="font-display text-4xl font-bold text-primary-fixed">
                22,760
              </span>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant">
              Automatically shifted <strong className="text-on-surface text-xs font-semibold">142 kWh</strong> to off-peak hours.
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid Row: Consumption Trend Line Chart & Eco Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pointer-events-auto">
        {/* Chart Panel */}
        <div className="col-span-10 lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col transition-all">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-on-surface">
                Consumption Trend
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-0.5">
                Daily kW usage across past {chartRange === "14D" ? "14" : "30"} days
              </p>
            </div>
            <div className="flex gap-1.5 bg-surface-container/60 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setChartRange("14D")}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  chartRange === "14D"
                    ? "bg-primary-fixed/25 text-primary-fixed border border-primary-fixed/30"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent"
                }`}
              >
                14D
              </button>
              <button
                onClick={() => setChartRange("30D")}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  chartRange === "30D"
                    ? "bg-primary-fixed/25 text-primary-fixed border border-primary-fixed/30"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent"
                }`}
              >
                30D
              </button>
            </div>
          </div>

          {/* Graph Simulation Canvas */}
          <div className="flex-1 relative min-h-[250px] mt-2 flex items-end border-b border-l border-white/10 pb-4 pl-3">
            {/* Y-axis metrics */}
            <div className="absolute left-[-32px] top-0 bottom-0 flex flex-col justify-between text-[10px] font-mono text-on-surface-variant/50 items-end pr-2 py-1">
              <span>60 kW</span>
              <span>40 kW</span>
              <span>20 kW</span>
              <span>0 kW</span>
            </div>

            {/* Background Grid Rules */}
            <div className="absolute inset-0 border-t border-white/5 top-1/3 pointer-events-none" />
            <div className="absolute inset-0 border-t border-white/5 top-2/3 pointer-events-none" />

            {/* Glowing Custom Area SVG lines */}
            <div className="w-full h-full relative z-10 transition-all duration-300">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="dashboardAreaGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(71, 255, 184, 0.25)" />
                    <stop offset="100%" stopColor="rgba(71, 255, 184, 0.0)" />
                  </linearGradient>
                </defs>

                {/* Drawn Filled Polygon Area */}
                <polygon
                  fill="url(#dashboardAreaGlow)"
                  points={activeAreaPoints}
                  className="transition-all duration-500"
                />

                {/* Outer Polyline border */}
                <polyline
                  fill="none"
                  points={activePoints}
                  stroke="#47ffb8"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(71,255,184,0.4)]"
                />

                {/* Highlight/Interactive Simulated Dot */}
                <circle
                  cx={hoverX}
                  cy={hoverY}
                  r="4"
                  fill="#011230"
                  stroke="#47ffb8"
                  strokeWidth="2"
                  className="animate-pulse"
                />

                {/* Highlight crosshair indicator line */}
                <line
                  stroke="rgba(255,255,255,0.15)"
                  strokeDasharray="2,2"
                  strokeWidth="0.5"
                  x1={hoverX}
                  x2={hoverX}
                  y1="0"
                  y2="100"
                />
              </svg>

              {/* Float-over Tooltip */}
              <div
                className="absolute bg-surface-container-high/95 border border-primary-fixed/30 rounded-lg px-2.5 py-1 text-center pointer-events-none shadow-xl transition-all duration-300"
                style={{
                  left: `${hoverX - 6}%`,
                  top: `${hoverY + 2}%`,
                }}
              >
                <div className="font-mono text-[9px] text-on-surface-variant">Today</div>
                <div className="font-mono text-xs font-bold text-primary-fixed">{hoverKw} kW</div>
              </div>
            </div>
          </div>

          {/* X axis interval timestamps */}
          <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant font-mono pl-3 relative pr-1">
            <span>{chartRange === "14D" ? "Oct 1" : "Sep 15"}</span>
            <span>{chartRange === "14D" ? "Oct 5" : "Oct 1"}</span>
            <span>{chartRange === "14D" ? "Oct 10" : "Oct 15"}</span>
            <span className="text-primary-fixed font-semibold">Today</span>
          </div>
        </div>

        {/* Eco Score Circular Gauge Panel */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col items-center justify-between min-h-[300px]">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-display text-lg font-bold text-on-surface">
              Eco Score
            </h3>
            <button 
              onClick={() => {
                alert(`Your Eco Score analyzes green energy metrics:\n- Grid Mix: Proportion of power harvested from solar, wind, & hydro.\n- Efficiency: Normalized rating vs nearby comparable units.`);
              }}
              className="text-on-surface-variant hover:text-primary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
          </div>

          {/* Radial Gauge Visual Progress */}
          <div className="relative w-44 h-44 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Ground level track backer */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="7"
              />
              {/* Highlight active progress circle */}
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="#47ffb8"
                strokeWidth="7.5"
                strokeDasharray="282.7"
                strokeDashoffset={circularProgressOffset}
                strokeLinecap="round"
                className="transition-all duration-[1200ms] ease-out-sine drop-shadow-[0_0_8px_rgba(71,255,184,0.4)]"
              />
            </svg>

            {/* Central rating numbers */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-5xl font-bold text-primary-fixed leading-none">
                {ecoScore}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant mt-1.5 uppercase tracking-widest font-semibold">
                {ecoScore >= 80 ? "Excellent" : "Good"}
              </span>
            </div>
          </div>

          {/* Sub-Metric Ratios */}
          <div className="w-full grid grid-cols-2 mt-2 pt-4 border-t border-white/5 divide-x divide-white/10 text-center">
            <div className="px-2">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block">
                Grid Mix
              </span>
              <span className="font-sans text-[14px] text-on-surface font-semibold block mt-0.5">
                64% Renew
              </span>
            </div>
            <div className="px-2">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block">
                Efficiency
              </span>
              <span className="font-sans text-[14px] text-on-surface font-semibold block mt-0.5">
                Top 15%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Major Consumers & AI Action Optimizer Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Appliance Consumers */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col transition-all">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-display text-lg font-bold text-on-surface">
              Major Consumers
            </h3>
            <span className="font-mono text-xs text-primary-fixed flex items-center gap-1">
              Active Monitoring
            </span>
          </div>

          <div className="flex flex-col gap-4.5">
            {appliances.map((app) => {
              // Map nice icons and values
              const valuePercentage = app.kwh === 342 ? "45%" : app.kwh === 128 ? "22%" : app.kwh === 85 ? "18%" : "15%";
              const percentageNum = app.kwh === 342 ? 45 : app.kwh === 128 ? 22 : app.kwh === 85 ? 18 : 15;
              return (
                <div key={app.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-2 text-on-surface font-medium">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        {app.icon}
                      </span>
                      {app.name}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${app.status === "running_high" ? "text-error" : "text-on-surface"}`}>
                      {valuePercentage}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-[1000ms] ${
                        app.status === "running_high"
                          ? "bg-gradient-to-r from-error to-red-400"
                          : "bg-gradient-to-r from-primary-fixed to-primary"
                      }`}
                      style={{ width: `${percentageNum}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Action Optimizer interactive showcase banner */}
        <div className="rounded-2xl p-[1px] relative overflow-hidden group transition-all">
          {/* Neon animated outline border */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed opacity-40 group-hover:opacity-75 transition-opacity duration-1000" />
          <div className="w-full h-full bg-surface-bright/50 backdrop-blur-xl rounded-[15px] p-6 flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary-fixed animate-spin" style={{ animationDuration: "5000ms" }}>
                  model_training
                </span>
                <span className="font-mono text-xs text-primary-fixed tracking-widest uppercase font-bold">
                  Active Optimization Panel
                </span>
              </div>
              <p className="font-sans text-sm text-on-surface md:leading-relaxed mb-4">
                {optimizationStatus === "active" && (
                  <>
                    Lumina has <strong>paused EV charging</strong> due to a projected peak grid pricing event at 5:00 PM. Charging is scheduled to resume at 9:00 PM using a 100% renewable mix.
                  </>
                )}
                {optimizationStatus === "paused" && (
                  <>
                    EV Charging Optimization has been temporarily deferred. The grid represents a high solar offset, but EV will hold until peak prices clear.
                  </>
                )}
                {optimizationStatus === "overridden" && (
                  <>
                    <strong className="text-secondary-fixed">Override Mode Triggered:</strong> EV is charging now at maximum rates. Peak grid rates may apply. AI optimization is bypassed for immediate readiness.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {optimizationStatus !== "active" ? (
                <button
                  onClick={() => {
                    setOptimizationStatus("active");
                    setEcoScore(Math.min(100, ecoScore + 2));
                  }}
                  className="px-4 py-2 bg-primary text-on-primary font-mono text-xs font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(193,255,221,0.4)] transition-all cursor-pointer"
                >
                  Apply AI Optimization
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOptimizationStatus("paused");
                    setEcoScore(Math.max(50, ecoScore - 2));
                  }}
                  className="px-4 py-2 bg-surface-container text-on-surface font-mono text-xs font-semibold rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Postpone optimization
                </button>
              )}

              <button
                onClick={() => {
                  setOptimizationStatus("overridden");
                  setEcoScore(Math.max(50, ecoScore - 4));
                }}
                className={`px-4 py-2 font-mono text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  optimizationStatus === "overridden"
                    ? "bg-red-500/25 text-red-300 border border-red-500/30"
                    : "bg-transparent text-on-surface-variant border border-white/10 hover:bg-white/5"
                }`}
              >
                Override (Charge Now)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
