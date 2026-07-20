export interface UtilityBill {
  id: string;
  month: string;
  electricityKwh: number;
  electricityCost: number;
  gasTherm?: number;
  gasCost?: number;
}

export interface Appliance {
  id: string;
  name: string;
  powerWatts: number;
  hoursPerDay: number;
  count: number;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  annualSavings: number;
  carbonSavingsKg: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface PredictiveScenario {
  name: string;
  description: string;
  estimatedCost: number;
  estimatedMonthlySavings: number;
  paybackPeriodMonths: number;
  yearlyCarbonReductionKg: number;
}

export interface AutomationScript {
  title: string;
  description: string;
  type: string;
  code: string;
}

export interface SdgImpact {
  title: string;
  description: string;
  points: string[];
}

export interface CybersecurityScorecard {
  score: number;
  issuesFound: string[];
  recommendations: string[];
}

export interface OptimizationReport {
  isMock: boolean;
  recommendations: Recommendation[];
  predictiveScenarios: PredictiveScenario[];
  automations: AutomationScript[];
  sdgImpact: SdgImpact;
  cybersecurityScorecard: CybersecurityScorecard;
  errorInfo?: string;
}

export interface FirewallLog {
  timestamp: string;
  event: string;
  ip: string;
  action: string;
}

export interface HouseholdUser {
  id: string;
  unit: string;
  name: string;
  role: "user" | "admin";
  avatar: string;
}

