import React, { useState } from "react";
import { ApplianceMetric } from "../types";

interface AnalyticsViewProps {
  appliances: ApplianceMetric[];
}

export default function AnalyticsView({ appliances }: AnalyticsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("Last 30 Days");

  // Filtering appliances list by user search input
  const filteredAppliances = appliances.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Analytics Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-1">
            Deep Dive Analytics
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            Analyzing consumption patterns and peak demands across your home grid.
          </p>
        </div>
        <div className="flex gap-2.5">
          {/* Time range selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-surface-container/60 border border-white/10 text-on-surface hover:text-white hover:border-white/25 transition-all text-xs font-mono py-2 pl-4 pr-10 rounded-lg appearance-none cursor-pointer focus:ring-1 focus:ring-primary-fixed focus:outline-none"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 12 Months</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>

          <button
            onClick={() => {
              // Creating a data export alert
              const fileContent = appliances
                .map((a) => `${a.name},${a.status},${a.kwh} kWh,₹${a.cost.toLocaleString('en-IN')},${a.rating} stars`)
                .join("\n");
              alert(`Export CSV Generated successfully:\n\nAppliance,Status,Usage,Cost,Rating\n${fileContent}`);
            }}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-mono text-xs font-bold hover:shadow-[0_0_15px_rgba(193,255,221,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Data
          </button>
        </div>
      </div>

      {/* Overview Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Daily Average
            </span>
            <span className="material-symbols-outlined text-primary-fixed">bolt</span>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-on-surface">
              24.5
              <span className="font-mono text-xs text-on-surface-variant ml-1">
                kWh
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-primary-fixed font-mono text-xs">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              <span>-12% vs last week</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Peak Usage Time
            </span>
            <span className="material-symbols-outlined text-secondary">schedule</span>
          </div>
          <div>
            <div className="font-display text-lg font-bold text-on-surface">
              6:00 PM - 9:00 PM
            </div>
            <div className="flex items-center gap-1 mt-3.5 text-on-surface-variant font-mono text-xs">
              <span>Typically Kitchen Appliances</span>
            </div>
          </div>
        </div>

        {/* Highest consuming appliance spotlight card */}
        <div className="glass-active border-primary/30 rounded-2xl p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-2 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
              Highest Consuming Appliance
            </span>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <div className="font-display text-2xl font-bold text-primary-fixed">
                HVAC System
              </div>
              <div className="text-on-surface-variant text-xs mt-1">
                Accounts for 45% of total monthly household draw
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold text-primary">
                342 kWh
              </div>
              <div className="font-mono text-[10px] text-primary/70 uppercase">
                This month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekend vs Weekday Chart & Peer Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pointer-events-auto">
        {/* Bar Chart Panel */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">
                Weekend vs Weekday
              </h3>
              <p className="text-on-surface-variant font-mono text-xs mt-0.5">
                Average hourly consumption comparison (kWh)
              </p>
            </div>
            {/* Legend */}
            <div className="flex gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary-fixed" />
                <span className="text-on-surface text-xs font-semibold">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-secondary opacity-50" />
                <span className="text-on-surface-variant text-xs">Weekday</span>
              </div>
            </div>
          </div>

          {/* SVG Custom Bar graph */}
          <div className="flex-1 w-full relative min-h-[180px] border-b border-white/5 pb-2">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 220">
              {/* Grid rules */}
              <line x1="0" y1="44" x2="800" y2="44" stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />
              <line x1="0" y1="88" x2="800" y2="88" stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />
              <line x1="0" y1="132" x2="800" y2="132" stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />
              <line x1="0" y1="176" x2="800" y2="176" stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />

              {/* Y markers */}
              <text x="10" y="44" fill="#84958a" fontFamily="JetBrains Mono" fontSize="9">4.0 kWh</text>
              <text x="10" y="88" fill="#84958a" fontFamily="JetBrains Mono" fontSize="9">3.0 kWh</text>
              <text x="10" y="132" fill="#84958a" fontFamily="JetBrains Mono" fontSize="9">2.0 kWh</text>
              <text x="10" y="176" fill="#84958a" fontFamily="JetBrains Mono" fontSize="9">1.0 kWh</text>

              {/* Hours metrics draw bars */}
              {/* Morning (6AM) */}
              <rect x="100" y="150" width="16" height="50" rx="3" fill="#b9c7e4" opacity="0.4" />
              <rect x="120" y="120" width="16" height="80" rx="3" fill="#47ffb8" />

              {/* Midday (12PM) */}
              <rect x="220" y="130" width="16" height="70" rx="3" fill="#b9c7e4" opacity="0.4" />
              <rect x="240" y="80" width="16" height="120" rx="3" fill="#47ffb8" />

              {/* Peak Evening (6PM) */}
              <rect x="340" y="100" width="16" height="100" rx="3" fill="#b9c7e4" opacity="0.4" />
              <rect x="360" y="50" width="16" height="150" rx="3" fill="#47ffb8" />

              {/* Night (9PM) */}
              <rect x="460" y="120" width="16" height="80" rx="3" fill="#b9c7e4" opacity="0.4" />
              <rect x="480" y="60" width="16" height="140" rx="3" fill="#47ffb8" />

              {/* Late Night (3AM) */}
              <rect x="580" y="170" width="16" height="30" rx="3" fill="#b9c7e4" opacity="0.4" />
              <rect x="600" y="150" width="16" height="50" rx="3" fill="#47ffb8" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-on-surface-variant font-mono pl-4 pr-4 mt-2">
            <span>6:00 AM</span>
            <span>12:00 PM</span>
            <span>3:00 PM</span>
            <span>6:00 PM</span>
            <span>9:00 PM</span>
            <span>12:00 AM</span>
            <span>3:00 AM</span>
          </div>
        </div>

        {/* Community Compare */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              Community Compare
            </h3>
            <p className="text-on-surface-variant font-mono text-xs">
              Similar households in your area
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-5 my-6">
            {/* User */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-primary-fixed font-bold">Your Home</span>
                <span className="text-primary-fixed font-bold">750 kWh</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary-fixed h-full rounded-full" style={{ width: "45%" }} />
              </div>
            </div>

            {/* Efficient peers */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface-variant">Top 20% Efficient peers</span>
                <span className="text-on-surface-variant">520 kWh</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-outline h-full rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            {/* General average */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-on-surface-variant">Average Home level</span>
                <span className="text-on-surface-variant">890 kWh</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-outline h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary-fixed mt-0.5">lightbulb</span>
              <p className="text-on-surface-variant font-sans text-xs leading-relaxed">
                You are consuming 15% less than your general neighborhood averages, but 44% more than highly efficient peers. Adjusting automated HVAC scheduling sets have the highest power correction values.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Appliance Breakdown data-table */}
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col transition-all">
        <div className="px-6 py-5 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-display text-lg font-bold text-on-surface">
            Appliance Breakdown
          </h3>
          <div className="flex items-center gap-2 bg-surface/40 px-3 py-1.5 rounded-lg border border-white/5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search appliances..."
              className="bg-transparent text-sm text-on-surface focus:outline-none border-0 p-0 focus:ring-0 placeholder:text-on-surface-variant/40 outline-none w-40"
            />
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                <th className="p-4 font-semibold">Appliance</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Est. Monthly Usage</th>
                <th className="p-4 font-semibold">Cost Impact</th>
                <th className="p-4 font-semibold text-center">Efficiency Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredAppliances.map((app) => {
                // Map rating of stars
                const goldenStars = Array(app.rating).fill(true);
                const whiteStars = Array(5 - app.rating).fill(true);
                return (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary-fixed">
                        <span className="material-symbols-outlined text-[18px]">
                          {app.icon}
                        </span>
                      </div>
                      <span className="text-on-surface font-semibold">{app.name}</span>
                    </td>
                    <td className="p-4">
                      {app.status === "running" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary-fixed font-mono text-[9px] uppercase border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" /> Running
                        </span>
                      )}
                      {app.status === "running_high" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error/10 text-error font-mono text-[9px] uppercase border border-error/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-error" /> Running High
                        </span>
                      )}
                      {app.status === "standby" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[9px] uppercase border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40" /> Standby
                        </span>
                      )}
                      {app.status === "off" && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[9px] uppercase border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Off
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-on-surface font-mono">{app.kwh} kWh</td>
                    <td className="p-4 text-on-surface font-mono">₹{app.cost.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1 p-1">
                        {goldenStars.map((_, idx) => (
                          <span
                            key={`g-${idx}`}
                            className="material-symbols-outlined text-primary-fixed text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                        {whiteStars.map((_, idx) => (
                          <span key={`w-${idx}`} className="material-symbols-outlined text-on-surface-variant/40 text-[14px]">
                            star
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAppliances.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant font-mono">
                    No matching consumer appliances discovered in home settings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
