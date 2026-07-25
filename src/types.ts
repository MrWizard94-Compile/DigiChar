export type TransactionType = 'income' | 'expense';

export type TransactionFrequency = 'one-time' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  frequency: TransactionFrequency;
  isSubscription?: boolean;
  isImpulse?: boolean;
  trialEndsAt?: string;
  notes?: string;
  tags?: string[];
}

export type SubscriptionStatus = 'active' | 'trial' | 'canceling' | 'paused';

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  isTrial: boolean;
  trialEndsAt?: string;
  cancellationUrl?: string;
  category: string;
  status: SubscriptionStatus;
  notes?: string;
}

export interface CouponCode {
  code: string;
  description: string;
  verified: boolean;
}

export interface SavingsTactic {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface CheaperAlternative {
  name: string;
  cost: string;
  keyAdvantage: string;
}

export interface CouponSearchResult {
  serviceName: string;
  estimatedAnnualSavings: number;
  promoCodes: CouponCode[];
  savingsTactics: SavingsTactic[];
  cheaperAlternatives: CheaperAlternative[];
  cancellationDifficulty: 'Easy' | 'Medium' | 'Hard';
  retentionDiscountTip: string;
}

export interface BenchmarkItem {
  id: string;
  appName: string;
  bestAt: string;
  killerFeature: string;
  deconstruction: string;
  cherryPickedLesson: string;
  implementedInDigiChar: string;
  enabled: boolean;
}

export interface AppDeconstructResponse {
  benchmarks: BenchmarkItem[];
  adhdErgonomicsScore: number;
  topRecommendation: string;
}

export interface CalculatorTapeItem {
  id: string;
  expression: string;
  result: number;
  timestamp: string;
  label?: string;
}

export interface ADHDPreferences {
  theme: 'emerald-dark' | 'violet-nord' | 'amber-warm' | 'cyber-tauri' | 'minimal-light';
  highContrast: boolean;
  hapticVisuals: boolean;
  showCalculator: boolean;
  weeklyBudgetLimit: number;
  monthlyBudgetLimit: number;
  focusMode: boolean;
  plainEnglishMode?: boolean;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'credit' | 'loan' | 'investment';
  balance: number;
  accountNumberLast4?: string;
  color?: string;
}

export interface BudgetEnvelope {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  color?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: string;
  icon?: string;
}

export interface ScrapedDeal {
  retailTarget: string;
  promoCode: string;
  description: string;
  absoluteConfidenceScore: number;
}
