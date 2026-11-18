import React from "react";
import { HomeSettings } from "../types";

interface HomeSetupViewProps {
  settings: HomeSettings;
  setSettings: (settings: HomeSettings) => void;
}

export default function HomeSetupView({ settings, setSettings }: HomeSetupViewProps) {
  
  const updateSettingsField = (field: keyof HomeSettings, value: any) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const updateThermostat = (type: "cooling" | "heating", val: number) => {
    setSettings({
      ...settings,
      tempSetpoints: {
        ...settings.tempSetpoints,
        [type]: val,
      },
    });
  };

  const handleSave = () => {
    alert(`Home Setup parameters synced securely!\n\n- Custom parameters saved: ${settings.squareFootage} sqft, occupants: ${settings.occupants}\n- Thermostat setback overrides: Cooling ${settings.tempSetpoints.cooling}°F, Heating ${settings.tempSetpoints.heating}°F.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-1">
          Home Setup & Controls
        </h2>
        <p className="font-sans text-sm text-on-surface-variant">
          Customize physical property matrices, equipment variables, and target thermostat setbacks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pointer-events-auto">
        {/* Core Controls Panel */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-display text-base font-bold text-on-surface border-b border-white/5 pb-2.5">
            Physical Profiles & Smart Appliances
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Square footage */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Square Footage ({settings.squareFootage} sq ft)
              </label>
              <input
                type="range"
                min="800"
                max="5000"
                step="100"
                value={settings.squareFootage}
                onChange={(e) => updateSettingsField("squareFootage", parseInt(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer h-1.5 rounded-lg bg-surface-container border-0"
              />
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/70 mt-1">
                <span>800 sq ft</span>
                <span>5,000 sq ft</span>
              </div>
            </div>

            {/* Occupants count */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Number of Occupants ({settings.occupants})
              </label>
              <select
                value={settings.occupants}
                onChange={(e) => updateSettingsField("occupants", parseInt(e.target.value))}
                className="w-full bg-surface-container border border-white/10 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-fixed py-2 px-3 rounded-lg text-sm appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} Occupants
                  </option>
                ))}
              </select>
            </div>

            {/* Space HVAC equipment type */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Heater & Cooling Equipment Type
              </label>
              <select
                value={settings.hvacType}
                onChange={(e) => updateSettingsField("hvacType", e.target.value)}
                className="w-full bg-surface-container border border-white/10 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-fixed py-2 px-3 rounded-lg text-sm appearance-none cursor-pointer"
              >
                <option value="Central HVAC">Central Air & Gas Furnace</option>
                <option value="Geothermal Split System">Geothermal Split Heat pump</option>
                <option value="Mini-Split Inverter">Ductless Mini-split inverter</option>
                <option value="Radiant Hot Water">Hydronic Radiant warm water</option>
              </select>
            </div>

            {/* Smart accessories switches */}
            <div className="flex flex-col justify-center gap-3">
              {/* EV */}
              <label className="flex items-center gap-3 select-none cursor-pointer group text-xs text-on-surface-variant font-mono">
                <input
                  type="checkbox"
                  checked={settings.hasEvCharger}
                  onChange={(e) => updateSettingsField("hasEvCharger", e.target.checked)}
                  className="rounded bg-surface-container border-white/10 text-primary-fixed focus:ring-1 focus:ring-primary-fixed/40 focus:ring-offset-0 h-4 w-4"
                />
                <span className="group-hover:text-on-surface transition-colors">Contains Residential EV Charging station</span>
              </label>

              {/* Solar panels */}
              <label className="flex items-center gap-3 select-none cursor-pointer group text-xs text-on-surface-variant font-mono">
                <input
                  type="checkbox"
                  checked={settings.hasSolarPanels}
                  onChange={(e) => updateSettingsField("hasSolarPanels", e.target.checked)}
                  className="rounded bg-surface-container border-white/10 text-primary-fixed focus:ring-1 focus:ring-primary-fixed/40 focus:ring-offset-0 h-4 w-4"
                />
                <span className="group-hover:text-on-surface transition-colors">Property holds solar PV panels</span>
              </label>
            </div>
          </div>

          <h3 className="font-display text-base font-bold text-on-surface border-b border-white/5 pb-2.5 mt-4">
            Target Thermostat Setpoints
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
            {/* Cooling setpoint */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Cooling Threshold Set setback ({settings.tempSetpoints.cooling}°F)
              </label>
              <input
                type="range"
                min="64"
                max="82"
                value={settings.tempSetpoints.cooling}
                onChange={(e) => updateThermostat("cooling", parseInt(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer h-1.5 rounded-lg bg-surface-container border-0"
              />
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/70 mt-1">
                <span>64 °F (High draw)</span>
                <span>82 °F (Eco setback)</span>
              </div>
            </div>

            {/* Heating setpoint */}
            <div>
              <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Heating Threshold setback ({settings.tempSetpoints.heating}°F)
              </label>
              <input
                type="range"
                min="55"
                max="75"
                value={settings.tempSetpoints.heating}
                onChange={(e) => updateThermostat("heating", parseInt(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer h-1.5 rounded-lg bg-surface-container border-0"
              />
              <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/70 mt-1">
                <span>55 °F (Eco setback)</span>
                <span>75 °F (High draw)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-on-primary font-mono text-xs font-bold rounded-lg hover:shadow-[0_0_15px_rgba(193,255,221,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              ✓ Save Setup Coordinates
            </button>
          </div>
        </div>

        {/* API Info & Guide Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed">vpn_key</span>
              Lumina AI Secrets Policy
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed space-y-2">
              Lumina Home Energy Assitant utilizes a hosted Google Gemini LLM server implementation.
              <br />
              <br />
              To connect the assistant and parser, you can save your <strong className="text-on-surface font-semibold">GEMINI_API_KEY</strong> securely using standard local environment variables.
              <br />
              <br />
              Open the <strong className="text-primary-fixed">Settings &gt; Secrets</strong> panel in the AI Studio editor interface to supply or update keys without exposing passwords in client-side outputs.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 bg-primary-fixed/[0.02]">
            <h3 className="font-display text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed">energy_savings_leaf</span>
              Lumina Offset Certs
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Based on your smart equipment profiles and setback parameters, your home is rated in class <strong className="text-primary-fixed font-bold">A- (Eco-Efficient)</strong>. Keep AI Pulse enabled to continue offsetting loads dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
