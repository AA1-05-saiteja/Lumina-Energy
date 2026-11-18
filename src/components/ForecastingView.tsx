import React, { useState } from "react";

interface ForecastingViewProps {
  ecoScore: number;
  setEcoScore: (score: number) => void;
}

export default function ForecastingView({ ecoScore, setEcoScore }: ForecastingViewProps) {
  const [forecastRange, setForecastRange] = useState<"24H" | "7D" | "30D">("24H");
  const [autoShiftEnabled, setAutoShiftEnabled] = useState<boolean>(false);
  const [tempSim, setTempSim] = useState<number>(32); // Weather simulator temp slider

  // Forecast coordinate bounds representing different range perspectives
  const rangeCoordinates = {
    "24H": {
      historicalLine: "M0,70 Q20,45 40,55",
      predictionLine: "M0,65 Q20,40 40,50 T80,25 T100,35",
      confidenceBand: "M0,80 Q20,60 40,70 T80,40 T100,50 L100,20 Q80,10 40,30 T0,50 Z",
      tooltipTime: "18:00 Tomorrow",
      tooltipValue: "3.8 kW",
      tooltipPos: { left: "60%", top: "20%" },
      labels: ["00:00", "06:00", "12:00", "18:00", "23:59"],
    },
    "7D": {
      historicalLine: "M0,50 Q20,60 40,50",
      predictionLine: "M0,50 Q20,60 40,50 T80,35 T100,45",
      confidenceBand: "M0,65 Q20,75 40,65 T80,50 T100,60 L100,25 Q80,25 40,40 T0,35 Z",
      tooltipTime: "Wednesday Peak",
      tooltipValue: "4.1 kW",
      tooltipPos: { left: "45%", top: "35%" },
      labels: ["Mon", "Wed", "Fri", "Sun", "Next Mon"],
    },
    "30D": {
      historicalLine: "M0,40 Q25,30 50,45",
      predictionLine: "M0,40 Q25,30 50,45 T80,55 T100,30",
      confidenceBand: "M0,55 Q25,45 50,60 T80,70 T100,45 L100,15 Q80,35 40,25 T0,25 Z",
      tooltipTime: "Late October Spikes",
      tooltipValue: "4.5 kW",
      tooltipPos: { left: "75%", top: "45%" },
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Month End"],
    },
  };

  const currentSelection = rangeCoordinates[forecastRange];

  // Dynamically responsive forecast factors driven by temp simulator
  const humidityImpact = tempSim >= 30 ? "High" : tempSim >= 22 ? "Medium" : "Low";
  const coolingDegreeDays = (tempSim * 0.38).toFixed(1);
  const next24Kwh = (24.5 + (tempSim - 32) * 0.45).toFixed(1);
  const next7Kwh = (168.2 + (tempSim - 32) * 2.8).toFixed(1);
  const next30Kwh = (740.0 + (tempSim - 32) * 11.5).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-1">
            Predictive Forecasting
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            AI-driven consumption modeling with a 94.2% confidence interval interval bandwidth.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-white/5 font-semibold">
            <span className="w-2.5 h-2.5 bg-primary-fixed rounded-full animate-pulse" />
            <span className="font-mono text-xs text-primary-fixed">
              Model: Auto-Regressive Deep Neural Net (Lumina v2.1)
            </span>
          </div>
        </div>
      </div>

      {/* High Usage Expected & Weather Correlation row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Peak demand Alert */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 relative overflow-hidden transition-all border-l-4 border-l-primary-fixed">
          {/* Decorative Back Drop */}
          <div className="absolute top-[-30px] right-[-30px] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[150px] text-primary-fixed">
              warning
            </span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 text-primary-fixed mb-3">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                electric_bolt
              </span>
              <span className="font-mono text-xs uppercase tracking-widest font-bold">
                Peak Demand Prediction
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-on-surface mb-3 leading-snug">
              High usage expected tomorrow at 18:00
            </h3>

            <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed mb-6">
              Based on incoming thermal fronts ({tempSim}°C tomorrow) and neighborhood consumption patterns, your local draw is predicted to spike to <strong className="text-on-surface font-semibold">4.2 kW</strong>. Pre-cooling your home prior to 16:00 is highly recommended to shift load.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setAutoShiftEnabled(!autoShiftEnabled);
                  setEcoScore(autoShiftEnabled ? ecoScore - 5 : ecoScore + 5);
                }}
                className={`px-5 py-2.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  autoShiftEnabled
                    ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(193,255,221,0.5)] border border-primary"
                    : "bg-surface-container hover:bg-white/5 border border-white/10 text-on-surface"
                }`}
              >
                {autoShiftEnabled ? "✓ Auto-Shift Activated" : "Enable Auto-Shift"}
              </button>
              <button
                onClick={() => alert(`Detailed Forecast Parameters:\n- Confidence: 94.2%\n- Predicted Draw: 4.2 kW (Duration: 2 hours)\n- Offsets: Precooling HVAC cools structural components saving up to 1.8 kWh of high-tariff draw.`)}
                className="bg-transparent border border-white/20 text-on-surface text-xs font-mono font-bold px-5 py-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                View Detail
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Weather Simulator */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                Weather Correlation
              </span>
              <span className="material-symbols-outlined text-primary-fixed">thermostat</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-4xl font-bold text-on-surface">
                {tempSim}°C
              </span>
              <span className="text-on-surface-variant text-sm font-medium">
                {tempSim >= 30 ? "High Heat tomorrow" : "Mild conditions"}
              </span>
            </div>

            {/* Weather slider control simulator */}
            <div className="mt-3">
              <label className="font-mono text-[9px] text-on-surface-variant uppercase block mb-1">
                Forecast Sim: Adjust Heat
              </label>
              <input
                type="range"
                min="18"
                max="40"
                value={tempSim}
                onChange={(e) => setTempSim(parseInt(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer h-1.5 rounded-lg bg-surface-container border-0"
              />
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Cooling Degree Days</span>
              <span className="text-on-surface font-mono font-medium">
                {coolingDegreeDays} kWh/day
              </span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary-fixed h-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (tempSim / 40) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-on-surface-variant">Humidity Impact factor</span>
              <span className={`font-mono font-bold text-xs ${humidityImpact === "High" ? "text-error" : humidityImpact === "Medium" ? "text-orange-400" : "text-primary-fixed"}`}>
                {humidityImpact}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizon estimates row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Estimate 1: 24h */}
        <div className="glass-panel rounded-xl p-5 border-t-2 border-t-primary-fixed">
          <div className="font-mono text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
            Next 24 Hours
          </div>
          <div className="font-display text-2xl font-bold text-on-surface mb-4">
            {next24Kwh} <span className="text-xs font-normal text-on-surface-variant font-mono">kWh</span>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Confidence Factor</span>
              <span className="text-primary-fixed font-bold">94%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Expected Range</span>
              <span className="text-on-surface">22.1 - 26.8</span>
            </div>
          </div>
        </div>

        {/* Estimate 2: 7 Days */}
        <div className="glass-panel rounded-xl p-5 border-t-2 border-t-secondary-fixed">
          <div className="font-mono text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
            Next 7 Days
          </div>
          <div className="font-display text-2xl font-bold text-on-surface mb-4">
            {next7Kwh} <span className="text-xs font-normal text-on-surface-variant font-mono">kWh</span>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Confidence Factor</span>
              <span className="text-secondary-fixed font-bold">82%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Expected Range</span>
              <span className="text-on-surface">155.0 - 182.4</span>
            </div>
          </div>
        </div>

        {/* Estimate 3: 30 Days */}
        <div className="glass-panel rounded-xl p-5 border-t-2 border-t-white/10">
          <div className="font-mono text-xs text-on-surface-variant mb-1 uppercase tracking-wider">
            Next 30 Days
          </div>
          <div className="font-display text-2xl font-bold text-on-surface mb-4">
            {next30Kwh} <span className="text-xs font-normal text-on-surface-variant font-mono">kWh</span>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Confidence Factor</span>
              <span className="text-on-surface-variant font-bold">68%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Expected Range</span>
              <span className="text-on-surface">690.5 - 810.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Simulation Forecast Chart Area */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg font-bold text-on-surface">
            Consumption Forecast Trend
          </h3>
          <div className="flex gap-1 bg-surface-container/60 p-1 rounded-lg border border-white/5">
            {["24H", "7D", "30D"].map((r) => (
              <button
                key={r}
                onClick={() => setForecastRange(r as any)}
                className={`px-3 py-1 font-mono text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  forecastRange === r
                    ? "bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 relative border-l border-b border-white/10 mt-4 h-[240px]">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
            <div className="w-full border-t border-white/5 h-0" />
            <div className="w-full border-t border-white/5 h-0" />
            <div className="w-full border-t border-white/5 h-0" />
            <div className="w-full border-t border-white/5 h-0" />
          </div>

          {/* Y Axis markings */}
          <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-on-surface-variant font-mono py-1 items-end pr-2">
            <span>4k kW</span>
            <span>3k kW</span>
            <span>2k kW</span>
            <span>1k kW</span>
            <span>0</span>
          </div>

          {/* SVG canvas visual layout */}
          <div className="absolute inset-0 overflow-hidden px-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Confidence Band Polygon */}
              <path
                d={currentSelection.confidenceBand}
                fill="rgba(71, 255, 184, 0.04)"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Forecast/Prediction dashed line path */}
              <path
                d={currentSelection.predictionLine}
                fill="none"
                stroke="#00f2a9"
                strokeDasharray="4,4"
                strokeWidth="1.5"
                className="opacity-70 transition-all duration-500 ease-in-out"
              />

              {/* Historical actual consumption line */}
              <path
                d={currentSelection.historicalLine}
                fill="none"
                stroke="#b9c7e4"
                strokeWidth="2"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Dividing vertical center rule */}
              <line
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="2,2"
                strokeWidth="1"
                x1="40"
                x2="40"
                y1="0"
                y2="100"
              />
            </svg>

            {/* Glowing fill styling backdrop under prediction curve */}
            <div 
              className="absolute bottom-0 left-[40%] right-0 h-[65%] opacity-20 pointer-events-none transition-all duration-500" 
              style={{
                background: "linear-gradient(to bottom, rgba(71, 255, 184, 0.2) 0%, transparent 100%)",
                clipPath: "polygon(0% 25%, 60% 0%, 100% 15%, 100% 100%, 0% 100%)"
              }}
            />

            {/* Glowing Hover simulated tooltip marker */}
            <div
              className="absolute bg-surface-container-high/90 p-2.5 rounded-lg border border-primary-fixed/25 pointer-events-none z-20 shadow-[0_0_15px_rgba(71,255,184,0.15)] transition-all duration-500 ease-in-out"
              style={currentSelection.tooltipPos}
            >
              <div className="text-[10px] text-on-surface-variant font-mono mb-0.5">
                {currentSelection.tooltipTime}
              </div>
              <div className="text-xs font-bold text-primary-fixed font-mono">
                {currentSelection.tooltipValue}
              </div>
            </div>
          </div>
        </div>

        {/* X Axis markings */}
        <div className="flex justify-between text-[10px] text-on-surface-variant font-mono mt-2 pr-1 pl-4">
          <span>{currentSelection.labels[0]}</span>
          <span>{currentSelection.labels[1]}</span>
          <span>{currentSelection.labels[2]}</span>
          <span>{currentSelection.labels[3]}</span>
          <span>{currentSelection.labels[4]}</span>
        </div>
      </div>
    </div>
  );
}
