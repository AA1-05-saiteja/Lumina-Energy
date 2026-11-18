import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ForecastingView from "./components/ForecastingView";
import AnalyticsView from "./components/AnalyticsView";
import RecommendationsView from "./components/RecommendationsView";
import BillUploadView from "./components/BillUploadView";
import HomeSetupView from "./components/HomeSetupView";
import ChatSidebar from "./components/ChatSidebar";
import { ActiveTab, ApplianceMetric, HomeSettings, Recommendation } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [ecoScore, setEcoScore] = useState<number>(82);
  const [aiPulseActive, setAiPulseActive] = useState<boolean>(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Dynamic values that can be updated from bill parses
  const [currentUsage, setCurrentUsage] = useState<number>(842);
  const [carbonIntensity, setCarbonIntensity] = useState<string>("Medium-Low (342 kg)");

  // Shared appliances metrics grid
  const [appliances, setAppliances] = useState<ApplianceMetric[]>([
    {
      id: "app-1",
      name: "Central HVAC System",
      status: "running",
      kwh: 342,
      cost: 2736.00,
      rating: 4,
      icon: "hvac",
    },
    {
      id: "app-2",
      name: "Water Heater (Standby)",
      status: "standby",
      kwh: 128,
      cost: 1024.00,
      rating: 3,
      icon: "water_heater",
    },
    {
      id: "app-3",
      name: "Refrigerator (Basement)",
      status: "running_high",
      kwh: 85,
      cost: 680.00,
      rating: 2,
      icon: "kitchen",
    },
    {
      id: "app-4",
      name: "Laundry Smart Washer",
      status: "off",
      kwh: 54,
      cost: 432.00,
      rating: 5,
      icon: "local_laundry_service",
    },
  ]);

  // Customizable Home Setup Settings
  const [homeSettings, setHomeSettings] = useState<HomeSettings>({
    squareFootage: 2400,
    occupants: 4,
    hasEvCharger: true,
    hasSolarPanels: false,
    hvacType: "Central HVAC",
    tempSetpoints: {
      cooling: 74,
      heating: 68,
    },
  });

  // Actionable sustainability engine suggestions
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "rec-1",
      title: "Reduce AC temperature setting by 2 hours tomorrow",
      category: "High Impact",
      savings: 3400.00,
      reduction: 120,
      co2: 45,
      effort: "Low",
      confidence: 94,
      status: "pending",
      icon: "hvac",
    },
    {
      id: "rec-2",
      title: "Shift Laundry cycles to Late-Night off-peak windows",
      category: "Medium Impact",
      savings: 1440.00,
      reduction: 45,
      co2: 12,
      effort: "Low",
      confidence: 92,
      status: "pending",
      icon: "local_laundry_service",
    },
    {
      id: "rec-3",
      title: "Assess residential solar roof PV feasibility",
      category: "High Impact",
      savings: 11600.00,
      reduction: 450,
      co2: 180,
      effort: "High",
      confidence: 88,
      status: "ignored",
      icon: "solar_power",
    },
  ]);

  // Execute recommendation handler
  const handleExecuteRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          if (rec.status === "applied") return rec;
          alert(`Lumina Energy AI has executed optimization rule:\n- Action: "${rec.title}"\n- Impact: Saved ₹${rec.savings.toLocaleString('en-IN', { maximumFractionDigits: 2 })}/mo & offsets ${rec.co2} lbs of CO2.`);
          return { ...rec, status: "applied" as const };
        }
        return rec;
      })
    );
  };

  // Render correct nested component page based on user routing
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            ecoScore={ecoScore}
            setEcoScore={setEcoScore}
            aiPulseActive={aiPulseActive}
            onExecuteRecommendation={handleExecuteRecommendation}
            appliances={appliances}
          />
        );
      case "forecasting":
        return <ForecastingView ecoScore={ecoScore} setEcoScore={setEcoScore} />;
      case "analytics":
        return <AnalyticsView appliances={appliances} />;
      case "recommendations":
        return (
          <RecommendationsView
            ecoScore={ecoScore}
            setEcoScore={setEcoScore}
            recommendations={recommendations}
            onExecuteRecommendation={handleExecuteRecommendation}
          />
        );
      case "bill_upload":
        return (
          <BillUploadView
            currentUsage={currentUsage}
            setCurrentUsage={setCurrentUsage}
            carbonIntensity={carbonIntensity}
            setCarbonIntensity={setCarbonIntensity}
          />
        );
      case "home_setup":
        return (
          <HomeSetupView settings={homeSettings} setSettings={setHomeSettings} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-on-surface bg-background select-none font-sans flex relative overflow-x-hidden">
      {/* Background radial overlays */}
      <div className="aurora-bg" />

      {/* Persistent & Responsive Sidebar navigation drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiPulseActive={aiPulseActive}
        setAiPulseActive={setAiPulseActive}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-w-0 transition-all flex flex-col min-h-screen pb-12">
        
        {/* Mobile Header Toolbar Nav Bar */}
        <header className="sticky top-0 bg-background/50 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 h-16 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger trigger for mobile size */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded border border-white/5">
              Secure Cloud Area: Grid Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Health Filter alert badge notification */}
            <button
              onClick={() => {
                alert(`Lumina Diagnostics Telemetry Warning:\n- Location: HVAC Filter Return air box.\n- Advisory: Filter particulate saturation reached 82%. A filter replacement is suggested within 10 days.`);
                setEcoScore(Math.min(100, ecoScore + 2));
              }}
              className="relative p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center border border-white/5"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            </button>

            {/* Smart Assistance direct float bubble click trigger */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-primary-fixed/10 border border-primary-fixed/20 text-xs font-mono text-primary-fixed hover:bg-primary-fixed/15 transition-all flex items-center gap-1.5 uppercase tracking-wider font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: "12s" }}>
                auto_awesome
              </span>
              Ask AI
            </button>
          </div>
        </header>

        {/* Dynamic Nested Tab Content Frame */}
        <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
          {renderActiveView()}
        </div>
      </main>

      {/* Lumina AI helper slidebox */}
      <ChatSidebar
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        homeSettings={homeSettings}
        appliancesCount={appliances.length}
        ecoScore={ecoScore}
      />
    </div>
  );
}
