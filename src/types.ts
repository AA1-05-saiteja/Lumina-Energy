export type ActiveTab = 
  | "dashboard" 
  | "forecasting" 
  | "analytics" 
  | "recommendations" 
  | "bill_upload" 
  | "home_setup";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isActionable?: boolean;
  actionText?: string;
  insightSummary?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: "High Impact" | "Medium Impact" | "Low Impact";
  savings: number; // monthly in USD
  reduction: number; // monthly in kWh
  co2: number; // monthly in lbs
  effort: "Low" | "Medium" | "High";
  confidence: number; // percentage
  status: "applied" | "pending" | "ignored";
  icon: string;
}

export interface HomeSettings {
  squareFootage: number;
  occupants: number;
  hasEvCharger: boolean;
  hasSolarPanels: boolean;
  hvacType: string;
  tempSetpoints: {
    cooling: number;
    heating: number;
  };
}

export interface ApplianceMetric {
  id: string;
  name: string;
  status: "running" | "standby" | "running_high" | "off";
  kwh: number;
  cost: number;
  rating: number; // 1 to 5 stars
  icon: string;
}
