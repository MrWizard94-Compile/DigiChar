import { useState, useEffect } from 'react';
import { 
  TauriWindowHeader 
} from './components/TauriWindowHeader';
import { 
  FinancialCalculator 
} from './components/FinancialCalculator';
import { 
  SubscriptionRadar 
} from './components/SubscriptionRadar';
import { 
  TransactionsManager 
} from './components/TransactionsManager';
import { 
  TrendsAndAnalytics 
} from './components/TrendsAndAnalytics';
import { 
  AppDeconstructBenchmark 
} from './components/AppDeconstructBenchmark';
import { 
  ADHDPreferencesModal 
} from './components/ADHDPreferencesModal';
import { 
  ExecutiveFunctionAssistant 
} from './components/ExecutiveFunctionAssistant';
import { 
  AccountsAndEnvelopes 
} from './components/AccountsAndEnvelopes';
import { 
  DealIntelligence 
} from './components/DealIntelligence';
import { 
  DataExportImportModal 
} from './components/DataExportImportModal';
import { 
  AIFinancialAssistantModal 
} from './components/AIFinancialAssistantModal';
import { 
  HelpMenuModal 
} from './components/HelpMenuModal';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_BENCHMARKS, 
  DEFAULT_PREFERENCES 
} from './data/initialData';
import { 
  Transaction, 
  SubscriptionItem, 
  BenchmarkItem, 
  ADHDPreferences 
} from './types';
import { Flame } from 'lucide-react';
import { clearDigiCharStorage, DIGICHAR_STORAGE_KEYS, loadJson, saveJson } from './services/persistence';

export default function App() {
  // Load state from local storage or defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadJson(DIGICHAR_STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS);
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    return loadJson(DIGICHAR_STORAGE_KEYS.subscriptions, INITIAL_SUBSCRIPTIONS);
  });

  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>(() => {
    return loadJson(DIGICHAR_STORAGE_KEYS.benchmarks, INITIAL_BENCHMARKS);
  });

  const [preferences, setPreferences] = useState<ADHDPreferences>(() => {
    return loadJson(DIGICHAR_STORAGE_KEYS.preferences, DEFAULT_PREFERENCES);
  });

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showCalculator, setShowCalculator] = useState<boolean>(preferences.showCalculator);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [showAiAdvisor, setShowAiAdvisor] = useState<boolean>(false);
  const [showDataExport, setShowDataExport] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [quickEntryOpen, setQuickEntryOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    saveJson(DIGICHAR_STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  useEffect(() => {
    saveJson(DIGICHAR_STORAGE_KEYS.subscriptions, subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    saveJson(DIGICHAR_STORAGE_KEYS.benchmarks, benchmarks);
  }, [benchmarks]);

  useEffect(() => {
    saveJson(DIGICHAR_STORAGE_KEYS.preferences, preferences);
  }, [preferences]);

  // Financial Computations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const monthlySubscriptionsCost = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'canceling' || sub.status === 'paused') return acc;
    return acc + (sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost);
  }, 0);

  const netMonthlyCashflow = totalIncome - totalExpense - monthlySubscriptionsCost;

  // Transaction Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 'tx-' + Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscription Handlers
  const handleAddSubscription = (newSub: Omit<SubscriptionItem, 'id'>) => {
    const sub: SubscriptionItem = {
      ...newSub,
      id: 'sub-' + Date.now(),
    };
    setSubscriptions((prev) => [sub, ...prev]);
  };

  const handleRemoveSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSubscriptionStatus = (id: string, status: SubscriptionItem['status']) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  // Calculator Result Applicator
  const handleApplyCalcResult = (amount: number, type: 'expense' | 'income') => {
    handleAddTransaction({
      title: `Calculator Entry (${type === 'income' ? 'Income' : 'Expense'})`,
      amount,
      type,
      category: type === 'income' ? 'Income' : 'Other',
      date: new Date().toISOString().split('T')[0],
      frequency: 'one-time',
      notes: 'Imported from built-in financial tape calculator'
    });
    setShowCalculator(false);
  };

  // Benchmark Toggles
  const handleToggleBenchmark = (id: string) => {
    setBenchmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Native Tauri Window Header */}
      <TauriWindowHeader
        preferences={preferences}
        onUpdatePreferences={(updated) => setPreferences((p) => ({ ...p, ...updated }))}
        onOpenCalculator={() => setShowCalculator(true)}
        onQuickAddTransaction={() => setQuickEntryOpen(true)}
        onOpenPreferences={() => setShowPreferences(true)}
        onOpenAiAdvisor={() => setShowAiAdvisor(true)}
        onOpenDataExport={() => setShowDataExport(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBalance={totalBalance}
        netMonthlyCashflow={netMonthlyCashflow}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Focus Mode Banner (If enabled) */}
        {preferences.focusMode && (
          <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-center justify-between font-mono animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                <strong>ADHD Focus Mode Active:</strong> Peripheral widgets hidden. Concentrating strictly on Safe-To-Spend decision making.
              </span>
            </div>
            <button
              onClick={() => setPreferences((p) => ({ ...p, focusMode: false }))}
              className="text-[10px] underline text-amber-300 hover:text-amber-100 cursor-pointer"
            >
              Exit Focus Mode
            </button>
          </div>
        )}

        {/* Tab 1: Executive Dysfunction Assistant */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-150">
            <ExecutiveFunctionAssistant
              transactions={transactions}
              subscriptions={subscriptions}
              preferences={preferences}
              onLogImpulse={(title, amount) => handleAddTransaction({
                title: `⚡ Impulse: ${title}`,
                amount,
                type: 'expense',
                category: 'Impulse',
                date: new Date().toISOString().split('T')[0],
                frequency: 'one-time',
                isImpulse: true,
                notes: 'Logged via Executive Function Impulse Interrupt'
              })}
              onCancelSub={(id) => handleUpdateSubscriptionStatus(id, 'canceling')}
              onOpenQuickEntry={() => setQuickEntryOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Accounts & Budget Envelopes */}
        {activeTab === 'accounts' && (
          <div className="animate-in fade-in duration-150">
            <AccountsAndEnvelopes />
          </div>
        )}

        {/* Tab 3: Expense & Income Transactions Manager */}
        {activeTab === 'transactions' && (
          <div className="animate-in fade-in duration-150">
            <TransactionsManager
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              quickEntryOpen={quickEntryOpen}
              onCloseQuickEntry={() => setQuickEntryOpen(false)}
            />
          </div>
        )}

        {/* Tab 4: Subscriptions & Free Trial Protection */}
        {activeTab === 'subscriptions' && (
          <div className="animate-in fade-in duration-150">
            <SubscriptionRadar
              subscriptions={subscriptions}
              onAddSubscription={handleAddSubscription}
              onRemoveSubscription={handleRemoveSubscription}
              onUpdateSubscriptionStatus={handleUpdateSubscriptionStatus}
            />
          </div>
        )}

        {/* Tab 5: Deal Intelligence & DOM Coupon Scraper */}
        {activeTab === 'deals' && (
          <div className="animate-in fade-in duration-150">
            <DealIntelligence />
          </div>
        )}

        {/* Tab 6: Weekly & Monthly Trends & Analytics */}
        {activeTab === 'trends' && (
          <div className="animate-in fade-in duration-150">
            <TrendsAndAnalytics
              transactions={transactions}
              preferences={preferences}
            />
          </div>
        )}

        {/* Tab 7: "Who does X best?" App Benchmarks */}
        {activeTab === 'benchmarks' && (
          <div className="animate-in fade-in duration-150">
            <AppDeconstructBenchmark
              benchmarks={benchmarks}
              onToggleBenchmark={handleToggleBenchmark}
              onUpdateBenchmarks={setBenchmarks}
            />
          </div>
        )}
      </main>

      {/* Slide-over Built-in Financial Tape Calculator */}
      <FinancialCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onApplyResultToTransaction={handleApplyCalcResult}
      />

      {/* Preferences & Settings Modal */}
      <ADHDPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onUpdatePreferences={(updated) => setPreferences((p) => ({ ...p, ...updated }))}
      />

      {/* Data Export / Restore Modal */}
      <DataExportImportModal
        isOpen={showDataExport}
        onClose={() => setShowDataExport(false)}
        transactions={transactions}
        subscriptions={subscriptions}
        preferences={preferences}
        onImportData={(txs, subs) => {
          if (txs.length) setTransactions(txs);
          if (subs.length) setSubscriptions(subs);
        }}
        onResetData={() => {
          clearDigiCharStorage();
          setTransactions(INITIAL_TRANSACTIONS);
          setSubscriptions(INITIAL_SUBSCRIPTIONS);
          setBenchmarks(INITIAL_BENCHMARKS);
          setPreferences(DEFAULT_PREFERENCES);
        }}
      />

      {/* AI Financial Advisor Modal */}
      <AIFinancialAssistantModal
        isOpen={showAiAdvisor}
        onClose={() => setShowAiAdvisor(false)}
        transactions={transactions}
        subscriptions={subscriptions}
      />

      {/* Complete Help & Documentation Center Modal */}
      <HelpMenuModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        onOpenCalculator={() => setShowCalculator(true)}
        onOpenAiAdvisor={() => setShowAiAdvisor(true)}
        onOpenDataExport={() => setShowDataExport(true)}
      />

      {/* Footer Status Bar */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>DigiChar v3.0.0 — Production Desktop Financial OS</span>
        </div>
        <div>
          SOUL v2.0.0 Standard Compliant • Low Executive Friction Architecture
        </div>
      </footer>
    </div>
  );
}
