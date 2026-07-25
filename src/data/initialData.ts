import { Transaction, SubscriptionItem, BenchmarkItem, ADHDPreferences } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Software Developer Paycheck',
    amount: 3200.00,
    type: 'income',
    category: 'Income',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'monthly',
    notes: 'Direct Deposit - Salary'
  },
  {
    id: 'tx-2',
    title: 'Freelance UI Design Milestone',
    amount: 850.00,
    type: 'income',
    category: 'Income',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'one-time',
    notes: 'Client app design deliverable'
  },
  {
    id: 'tx-3',
    title: 'Apartment Rent & Utilities',
    amount: 1450.00,
    type: 'expense',
    category: 'Housing',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'monthly',
    notes: 'Autopay set up'
  },
  {
    id: 'tx-4',
    title: 'Organic Groceries & Meal Prep',
    amount: 184.50,
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'weekly',
    notes: 'Trader Joes'
  },
  {
    id: 'tx-5',
    title: 'ChatGPT Plus Subscription',
    amount: 20.00,
    type: 'expense',
    category: 'Subscriptions',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'monthly',
    isSubscription: true
  },
  {
    id: 'tx-6',
    title: 'Specialty Espresso Coffee',
    amount: 14.80,
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    frequency: 'one-time',
    notes: 'Local Roasters dopamine boost'
  },
  {
    id: 'tx-7',
    title: 'Gym & Rock Climbing Pass',
    amount: 65.00,
    type: 'expense',
    category: 'Health',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'monthly',
    isSubscription: true
  }
];

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-1',
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cancellationUrl: 'https://account.adobe.com/plans',
    category: 'Design & Software',
    status: 'trial',
    notes: '7-day trial ends in 2 days! Search coupons or cancel before $54.99 charge.'
  },
  {
    id: 'sub-2',
    name: 'Spotify Premium Family',
    cost: 16.99,
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isTrial: false,
    category: 'Entertainment',
    status: 'active',
    notes: 'Split with household members ($4.25/person)'
  },
  {
    id: 'sub-3',
    name: 'GitHub Copilot & Pro',
    cost: 10.00,
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isTrial: false,
    category: 'Development',
    status: 'active',
    notes: 'Essential coding assistant'
  },
  {
    id: 'sub-4',
    name: 'Oura Ring Health Membership',
    cost: 5.99,
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Health & Sleep',
    status: 'trial',
    notes: 'Free 1-month trial ends soon'
  },
  {
    id: 'sub-5',
    name: 'Audible Audiobooks Premium',
    cost: 14.95,
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isTrial: false,
    category: 'Entertainment',
    status: 'canceling',
    notes: 'Retention offer activated - 50% off pending'
  }
];

export const INITIAL_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'bench-1',
    appName: 'Copilot Money',
    bestAt: 'Who does ADHD Cognitive Friction Reduction best?',
    killerFeature: 'Micro-progress bars & vivid visual chunks',
    deconstruction: 'Replaces dense tables with visual progress meters that give instant dopamine feedback on remaining weekly budget without requiring mental math.',
    cherryPickedLesson: 'Implemented visual status bars, high-contrast badges, and quick 1-click expense logging.',
    implementedInDigiChar: 'DigiChar Visual Chunks & ADHD Focus Mode',
    enabled: true
  },
  {
    id: 'bench-2',
    appName: 'Rocket Money',
    bestAt: 'Who does Subscription & Free Trial Protection best?',
    killerFeature: 'Active trial countdown radar & deal search',
    deconstruction: 'Alerts users before free trial expires and automates coupon search & retention negotiation strategies.',
    cherryPickedLesson: 'Built an integrated desktop deal strategy engine for promo codes, retention scripts, and cancellation guides.',
    implementedInDigiChar: 'DigiChar Subscription Radar & Deal Hunter',
    enabled: true
  },
  {
    id: 'bench-3',
    appName: 'YNAB (You Need A Budget)',
    bestAt: 'Who does Envelope & Zero-Based Allocation best?',
    killerFeature: 'Give Every Dollar A Job rule',
    deconstruction: 'Eliminates passive account balance delusion by assigning every incoming income transaction to specific goal buckets immediately.',
    cherryPickedLesson: 'Included 50/30/20 & custom income allocation shortcuts directly into the transaction modal and built-in calculator.',
    implementedInDigiChar: 'DigiChar Smart Income Allocator',
    enabled: true
  },
  {
    id: 'bench-4',
    appName: 'Splitwise',
    bestAt: 'Who does Quick On-Screen Calculation & Split Math best?',
    killerFeature: 'Embedded expression calculator with tape memory',
    deconstruction: 'Keeps calculation context inside the app so users do not context-switch out to a separate desktop calculator app.',
    cherryPickedLesson: 'Embedded a dedicated desktop tape calculator widget with percentage, tip, tax, and allowance math tools.',
    implementedInDigiChar: 'DigiChar Built-in Desktop Tape Calculator',
    enabled: true
  },
  {
    id: 'bench-5',
    appName: 'Monarch Money',
    bestAt: 'Who does Trend & Cashflow Visualization best?',
    killerFeature: 'Sankey-style income vs expense trend flow',
    deconstruction: 'Maps weekly and monthly cash velocity in visual chart blocks rather than walls of text.',
    cherryPickedLesson: 'Built interactive weekly & monthly Recharts area & bar charts with trend breakdown and budget threshold warning highlights.',
    implementedInDigiChar: 'DigiChar Interactive Trend Visualizer',
    enabled: true
  }
];

export const DEFAULT_PREFERENCES: ADHDPreferences = {
  theme: 'cyber-tauri',
  highContrast: false,
  hapticVisuals: true,
  showCalculator: true,
  weeklyBudgetLimit: 350,
  monthlyBudgetLimit: 1600,
  focusMode: false,
};
