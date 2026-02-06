
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Party {
  name: string;
  role: string;
}

export interface FinancialDetail {
  description: string;
  amount: string;
}

export interface ClauseAnalysis {
  title: string;
  originalText: string;
  explanation: string;
  riskLevel: RiskLevel;
  riskReason: string;
  suggestedAlternative: string;
  category: 'FINANCIAL' | 'LIABILITY' | 'TERMINATION' | 'IP' | 'CONFIDENTIALITY' | 'JURISDICTION' | 'OBLIGATION' | 'OTHER';
}

export interface ContractAnalysisResult {
  id: string;
  timestamp: string;
  contractType: string;
  parties: Party[];
  summary: string;
  compositeRiskScore: number; // 0-100
  financials: FinancialDetail[];
  keyDates: { date: string; description: string }[];
  jurisdiction: string;
  governingLaw: string;
  clauses: ClauseAnalysis[];
  isHindiDetected: boolean;
}

export interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
}
