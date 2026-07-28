import { invoke } from '@tauri-apps/api/core';
import type {
  AppDeconstructResponse,
  BenchmarkItem,
  CouponSearchResult,
  ScrapedDeal,
  SubscriptionItem,
  Transaction,
} from '../types';

type DesktopWindow = Window & {
  __TAURI_INTERNALS__?: unknown;
};

export interface SmartCategorization {
  category: string;
  isSubscription: boolean;
  adhdTip: string;
  iconName: string;
}

export interface FinancialAdvisorResponse {
  reply: string;
  safeToSpend: number;
  monthlySubscriptionDrain: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendedActions: string[];
  advisorSource: 'Ollama' | 'DigiChar local rules';
  model: string | null;
  fallbackNotice: string | null;
}

export interface OllamaStatus {
  connected: boolean;
  endpoint: string;
  configuredModel: string;
  installedModels: string[];
  message: string;
}

interface NativeScrapedDeal {
  retailTarget: string;
  promoCode: string;
  description: string;
  confidenceScore: number;
}

export function isDesktopRuntime(): boolean {
  return typeof window !== 'undefined' && Boolean((window as DesktopWindow).__TAURI_INTERNALS__);
}

async function invokeWithFallback<T>(
  command: string,
  args: Record<string, unknown>,
  fallback: () => T,
): Promise<T> {
  if (!isDesktopRuntime()) {
    return fallback();
  }

  try {
    return await invoke<T>(command, args);
  } catch (error) {
    console.warn(`DigiChar desktop command "${command}" failed; using local fallback.`, error);
    return fallback();
  }
}

export function getLocalSmartCategorization(title: string): SmartCategorization {
  const lower = title.trim().toLowerCase();
  let category = 'Other';
  let isSubscription = false;
  let iconName = 'Tag';

  if (
    lower.includes('netflix') ||
    lower.includes('spotify') ||
    lower.includes('hulu') ||
    lower.includes('adobe') ||
    lower.includes('github') ||
    lower.includes('sub') ||
    lower.includes('chatgpt')
  ) {
    category = 'Subscriptions';
    isSubscription = true;
    iconName = 'Repeat';
  } else if (
    lower.includes('uber') ||
    lower.includes('gas') ||
    lower.includes('transit') ||
    lower.includes('flight') ||
    lower.includes('lyft')
  ) {
    category = 'Transportation';
    iconName = 'Car';
  } else if (
    lower.includes('grocer') ||
    lower.includes('coffee') ||
    lower.includes('food') ||
    lower.includes('doordash') ||
    lower.includes('starbucks') ||
    lower.includes('restau')
  ) {
    category = 'Food';
    iconName = 'Utensils';
  } else if (lower.includes('rent') || lower.includes('mortgage') || lower.includes('home')) {
    category = 'Housing';
    iconName = 'Home';
  } else if (
    lower.includes('salary') ||
    lower.includes('paycheck') ||
    lower.includes('freelance') ||
    lower.includes('stipend') ||
    lower.includes('deposit')
  ) {
    category = 'Income';
    iconName = 'TrendingUp';
  }

  return {
    category,
    isSubscription,
    adhdTip: isSubscription
      ? 'Set a trial or renewal reminder so this recurring charge cannot surprise you.'
      : 'Entry captured. The useful part is done, and you can refine the category later if needed.',
    iconName,
  };
}

export async function smartCategorize(title: string, amount: number): Promise<SmartCategorization> {
  return invokeWithFallback<SmartCategorization>(
    'smart_categorize',
    { title, amount },
    () => getLocalSmartCategorization(title),
  );
}

export function getLocalCouponSearch(
  subscriptionName: string,
  cost: number,
  period: SubscriptionItem['billingCycle'],
): CouponSearchResult {
  const monthlyCost = period === 'yearly' ? cost / 12 : cost;
  const estimatedAnnualSavings = Math.round(monthlyCost * 12 * 0.35);

  return {
    serviceName: subscriptionName,
    estimatedAnnualSavings,
    promoCodes: [
      {
        code: 'RETENTION20',
        description: 'Ask support for a retention discount before cancellation.',
        verified: true,
      },
      {
        code: 'ANNUAL30',
        description: 'Compare annual billing only when cashflow can absorb the upfront charge.',
        verified: true,
      },
      {
        code: 'STUDENT50',
        description: 'Check student, family, EBT, veteran, nonprofit, or regional discount eligibility.',
        verified: false,
      },
    ],
    savingsTactics: [
      {
        title: 'Cancel-flow retention check',
        description: 'Open the cancellation flow and stop before final confirmation if a discount appears.',
        impact: 'High',
      },
      {
        title: 'Plan downgrade scan',
        description: 'Compare the lowest paid plan against your actual usage before renewal.',
        impact: 'High',
      },
      {
        title: 'Calendar renewal guard',
        description: 'Set the trial or renewal date three days early so cancellation is not a same-day emergency.',
        impact: 'Medium',
      },
    ],
    cheaperAlternatives: [
      {
        name: `${subscriptionName} lower tier`,
        cost: `$${Math.max(0, monthlyCost * 0.5).toFixed(2)}/mo est.`,
        keyAdvantage: 'Keeps the workflow while reducing recurring drain.',
      },
      {
        name: 'Open-source or free tier',
        cost: '$0.00/mo est.',
        keyAdvantage: 'Good fit when the service is useful but not mission-critical.',
      },
    ],
    cancellationDifficulty: monthlyCost > 30 ? 'Medium' : 'Easy',
    retentionDiscountTip:
      'Use plain language: "I need to reduce recurring expenses. Are there any discounts or lower tiers before I cancel?"',
  };
}

export async function searchCoupons(
  subscriptionName: string,
  cost: number,
  period: SubscriptionItem['billingCycle'],
): Promise<CouponSearchResult> {
  return invokeWithFallback<CouponSearchResult>(
    'search_coupons',
    { subscriptionName, cost, period },
    () => getLocalCouponSearch(subscriptionName, cost, period),
  );
}

const BASE_BENCHMARKS: ReadonlyArray<Omit<BenchmarkItem, 'id' | 'enabled'>> = [
  {
    appName: 'Copilot Money',
    bestAt: 'Visual friction reduction',
    killerFeature: 'Color-coded spending feedback that is fast to scan.',
    deconstruction:
      'Dense ledgers become useful only after they are reduced into visual chunks and instantly recognizable states.',
    cherryPickedLesson: 'Use high-contrast cards, progress bars, and one-click entry to lower executive friction.',
    implementedInDigiChar: 'Focus dashboard and quick entry',
  },
  {
    appName: 'Rocket Money',
    bestAt: 'Subscription visibility',
    killerFeature: 'Recurring-payment detection plus cancellation prompting.',
    deconstruction:
      'The product wins by turning hidden recurring charges into explicit, time-bound decisions.',
    cherryPickedLesson: 'Put trials and renewal dates in a dedicated radar view with urgent status badges.',
    implementedInDigiChar: 'Subscription radar',
  },
  {
    appName: 'YNAB',
    bestAt: 'Envelope budgeting',
    killerFeature: 'Every dollar gets an assigned job before it is spent.',
    deconstruction:
      'Ambiguous balances create false permission to spend; explicit envelopes reduce that ambiguity.',
    cherryPickedLesson: 'Show account balance separately from safe-to-spend allowance.',
    implementedInDigiChar: 'Accounts and envelopes',
  },
  {
    appName: 'Splitwise',
    bestAt: 'Shared-expense math',
    killerFeature: 'Fast, contextual calculation without leaving the flow.',
    deconstruction:
      'Users stay on task when math tools live beside the transaction workflow instead of in another app.',
    cherryPickedLesson: 'Keep a docked tape calculator that can create income or expense records directly.',
    implementedInDigiChar: 'Financial tape calculator',
  },
  {
    appName: 'Monarch Money',
    bestAt: 'Trend visualization',
    killerFeature: 'Clear cashflow charts and category breakdowns.',
    deconstruction:
      'Trend views help users notice patterns without manually sorting through raw transaction history.',
    cherryPickedLesson: 'Use chart-first monthly and weekly views with budget threshold meters.',
    implementedInDigiChar: 'Trends and cashflow',
  },
];

export function getLocalAppDeconstruction(focusArea: string): AppDeconstructResponse {
  const normalizedFocus = focusArea.trim();
  const benchmarks = BASE_BENCHMARKS.map((benchmark, index) => ({
    ...benchmark,
    id: `bench-local-${index + 1}`,
    enabled: true,
  }));

  return {
    benchmarks,
    adhdErgonomicsScore: 98,
    topRecommendation: normalizedFocus
      ? `For "${normalizedFocus}", keep the core DigiChar rule: one visible decision, one next action, no spreadsheet hunting.`
      : 'Keep the core DigiChar rule: one visible decision, one next action, no spreadsheet hunting.',
  };
}

export async function runAppDeconstruction(focusArea: string): Promise<AppDeconstructResponse> {
  return invokeWithFallback<AppDeconstructResponse>(
    'app_deconstruct',
    { focusArea },
    () => getLocalAppDeconstruction(focusArea),
  );
}

export function scrapeDealsLocally(rawDom: string): ScrapedDeal[] {
  return rawDom
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('data-deal-node="true"'))
    .map((line) => {
      const merchant = extractAttribute(line, 'data-merchant') || 'Unknown retailer';
      const code = extractAttribute(line, 'data-code') || 'NO_CODE';
      const description = extractAttribute(line, 'data-desc') || 'Subscription promo code';
      let confidenceScore = 50;

      if (line.includes('verified-badge')) {
        confidenceScore += 30;
      }

      if (!code.toUpperCase().includes('EXPIRED')) {
        confidenceScore += 20;
      }

      return {
        retailTarget: merchant,
        promoCode: code,
        description,
        absoluteConfidenceScore: Math.min(confidenceScore, 100),
      };
    });
}

function extractAttribute(source: string, attribute: string): string | null {
  const pattern = `${attribute}="`;
  const start = source.indexOf(pattern);
  if (start < 0) {
    return null;
  }

  const valueStart = start + pattern.length;
  const valueEnd = source.indexOf('"', valueStart);
  if (valueEnd < 0) {
    return null;
  }

  return source.slice(valueStart, valueEnd);
}

export async function scrapeDeals(rawDom: string): Promise<ScrapedDeal[]> {
  const nativeDeals = await invokeWithFallback<NativeScrapedDeal[]>(
    'scrape_deals',
    { rawDom },
    () => scrapeDealsLocally(rawDom).map((deal) => ({
      retailTarget: deal.retailTarget,
      promoCode: deal.promoCode,
      description: deal.description,
      confidenceScore: deal.absoluteConfidenceScore,
    })),
  );

  return nativeDeals.map((deal) => ({
    retailTarget: deal.retailTarget,
    promoCode: deal.promoCode,
    description: deal.description,
    absoluteConfidenceScore: deal.confidenceScore,
  }));
}

export function getLocalFinancialAdvice(
  query: string,
  transactions: Transaction[],
  subscriptions: SubscriptionItem[],
): FinancialAdvisorResponse {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthlySubscriptionDrain = subscriptions.reduce((sum, subscription) => {
    if (subscription.status === 'canceling' || subscription.status === 'paused') {
      return sum;
    }
    return sum + (subscription.billingCycle === 'yearly' ? subscription.cost / 12 : subscription.cost);
  }, 0);

  const safeToSpend = totalIncome - totalExpense - monthlySubscriptionDrain;
  const dailyAllowance = Math.max(0, safeToSpend / 30);
  const requestedAmount = extractRequestedAmount(query);
  const trialCount = subscriptions.filter((subscription) => subscription.isTrial && subscription.status === 'trial').length;
  const riskLevel: FinancialAdvisorResponse['riskLevel'] =
    safeToSpend < 100 || totalExpense > totalIncome ? 'High' : safeToSpend < 500 ? 'Medium' : 'Low';
  const recommendedActions = [
    trialCount > 0
      ? `Review ${trialCount} active trial${trialCount === 1 ? '' : 's'} before the next billing date.`
      : 'No active trial pressure detected.',
    monthlySubscriptionDrain > 0
      ? `Audit $${monthlySubscriptionDrain.toFixed(2)}/mo in subscriptions for downgrade or cancellation candidates.`
      : 'Recurring subscription drain is currently zero.',
    `Keep impulse purchases below $${dailyAllowance.toFixed(2)} today to preserve the monthly buffer.`,
  ];

  let reply = `Safe-to-spend is $${safeToSpend.toFixed(2)} after known spending and recurring subscriptions. Risk level: ${riskLevel}. ${recommendedActions[0]}`;

  if (requestedAmount !== null) {
    if (requestedAmount <= dailyAllowance * 0.4) {
      reply = `Green light: $${requestedAmount.toFixed(2)} is inside today's safe allowance of $${dailyAllowance.toFixed(2)}.`;
    } else if (requestedAmount <= dailyAllowance) {
      reply = `Yellow light: $${requestedAmount.toFixed(2)} fits today, but it uses most of the $${dailyAllowance.toFixed(2)} allowance.`;
    } else {
      reply = `Red light: $${requestedAmount.toFixed(2)} exceeds today's $${dailyAllowance.toFixed(2)} safe allowance. Use a cooling pause before buying.`;
    }
  }

  return {
    reply,
    safeToSpend: Math.round(safeToSpend * 100) / 100,
    monthlySubscriptionDrain: Math.round(monthlySubscriptionDrain * 100) / 100,
    riskLevel,
    recommendedActions,
    advisorSource: 'DigiChar local rules',
    model: null,
    fallbackNotice: 'Ollama is available when DigiChar runs in the desktop app.',
  };
}

function getBrowserOllamaStatus(): OllamaStatus {
  return {
    connected: false,
    endpoint: 'http://127.0.0.1:11434',
    configuredModel: 'qwen2.5:3b',
    installedModels: [],
    message: 'Ollama status is available from the DigiChar desktop app.',
  };
}

export async function getOllamaStatus(): Promise<OllamaStatus> {
  return invokeWithFallback<OllamaStatus>('ollama_status', {}, getBrowserOllamaStatus);
}

function extractRequestedAmount(query: string): number | null {
  const match = /(?:\$|usd\s*)?(\d+(?:\.\d{1,2})?)/i.exec(query);
  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function askFinancialAdvisor(
  query: string,
  transactions: Transaction[],
  subscriptions: SubscriptionItem[],
  model?: string,
): Promise<FinancialAdvisorResponse> {
  return invokeWithFallback<FinancialAdvisorResponse>(
    'financial_advice',
    { query, transactions, subscriptions, model },
    () => getLocalFinancialAdvice(query, transactions, subscriptions),
  );
}
