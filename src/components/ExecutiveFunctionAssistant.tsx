import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  Sparkles,
  DollarSign,
  HeartPulse,
  Brain,
  Timer,
  ShoppingBag,
} from 'lucide-react';
import { Transaction, SubscriptionItem, ADHDPreferences } from '../types';

interface ExecutiveAssistantProps {
  transactions: Transaction[];
  subscriptions: SubscriptionItem[];
  preferences: ADHDPreferences;
  onLogImpulse: (title: string, amount: number) => void;
  onCancelSub: (id: string) => void;
  onOpenQuickEntry: () => void;
}

export const ExecutiveFunctionAssistant: React.FC<ExecutiveAssistantProps> = ({
  transactions,
  subscriptions,
  preferences,
  onLogImpulse,
  onCancelSub,
  onOpenQuickEntry,
}) => {
  const [impulseTitle, setImpulseTitle] = useState('');
  const [impulseAmount, setImpulseAmount] = useState('');
  const [coolingTimerActive, setCoolingTimerActive] = useState(false);
  const [coolingSeconds, setCoolingSeconds] = useState(15);
  const [showImpulseModal, setShowImpulseModal] = useState(false);

  // Can I Afford This instant checker state
  const [checkItemName, setCheckItemName] = useState('');
  const [checkItemCost, setCheckItemCost] = useState('');

  const isPlain = Boolean(preferences.plainEnglishMode);
  const safeToSpendLabel = isPlain ? 'Money Left After Bills' : 'Safe to Spend';
  const safeToSpendHelp = isPlain
    ? 'Cash left after known spending and recurring bills.'
    : 'Total liquidity minus 30-day recurring obligations.';

  // Financial Computations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const monthlySubs = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'canceling' || sub.status === 'paused') return acc;
    return acc + (sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost);
  }, 0);

  const safeToSpend = totalBalance - monthlySubs;
  const todayBudget = Math.max(0, Math.round((safeToSpend / 30) * 100) / 100);

  // Can I Afford This traffic light verdict computation
  const parsedCheckCost = parseFloat(checkItemCost) || 0;
  let trafficVerdict: {
    status: 'GREEN' | 'YELLOW' | 'RED' | 'IDLE';
    title: string;
    reason: string;
    colorClass: string;
    badgeClass: string;
  } = {
    status: 'IDLE',
    title: 'Type a price above',
    reason: 'Enter an item price to get an instant, foolproof Green/Yellow/Red traffic light verdict.',
    colorClass: 'text-slate-400',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  if (parsedCheckCost > 0) {
    if (parsedCheckCost <= todayBudget * 0.4) {
      trafficVerdict = {
        status: 'GREEN',
        title: '🟢 YES! SAFE TO BUY',
        reason: `This consumes only ${Math.round((parsedCheckCost / Math.max(1, todayBudget)) * 100)}% of today's $${todayBudget} safe allowance. No stress!`,
        colorClass: 'text-emerald-400',
        badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-700/80',
      };
    } else if (parsedCheckCost <= todayBudget) {
      trafficVerdict = {
        status: 'YELLOW',
        title: '🟡 CAUTION REQUIRED',
        reason: `This consumes ${Math.round((parsedCheckCost / Math.max(1, todayBudget)) * 100)}% of today's $${todayBudget} allowance. You'll have $${(todayBudget - parsedCheckCost).toFixed(2)} left.`,
        colorClass: 'text-amber-300',
        badgeClass: 'bg-amber-950 text-amber-300 border-amber-700/80',
      };
    } else {
      trafficVerdict = {
        status: 'RED',
        title: '🔴 DANGER! OVER BUDGET',
        reason: `This exceeds today's $${todayBudget} allowance by $${(parsedCheckCost - todayBudget).toFixed(2)}! Consider taking a 24-hour cooling pause.`,
        colorClass: 'text-rose-400',
        badgeClass: 'bg-rose-950 text-rose-300 border-rose-700/80',
      };
    }
  }

  // Next due subscription
  const sortedSubs = [...subscriptions]
    .filter((s) => s.status !== 'canceling')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  const nextSub = sortedSubs[0];

  const daysToNextSub = nextSub 
    ? Math.max(0, Math.ceil((new Date(nextSub.nextBillingDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : null;

  // Derive Single Recommended Action
  const trialEndingSoon = subscriptions.find((s) => s.isTrial && s.status === 'trial');
  const impulseCountToday = transactions.filter(
    (t) => t.isImpulse && new Date(t.date).toDateString() === new Date().toDateString()
  ).length;

  let recommendedAction: {
    title: string;
    subtitle: string;
    badge: string;
    type: 'success' | 'warning' | 'danger';
    actionText: string;
    onClick: () => void;
  } = {
    title: 'Maintain Healthy Spending Cadence',
    subtitle: `You have $${todayBudget} safe daily budget available today. Keep impulse spending under control.`,
    badge: '[SAL_OPTIMAL_GREEN] System Optimal',
    type: 'success',
    actionText: 'Quick Log Expense',
    onClick: onOpenQuickEntry,
  };

  if (trialEndingSoon) {
    recommendedAction = {
      title: `Cancel Trial for ${trialEndingSoon.name}`,
      subtitle: `Trial ends in 2 days! Cancel now or request a deal to prevent being billed $${trialEndingSoon.cost}/mo.`,
      badge: '[SAL_CRITICAL_RED] Free Trial Action Required',
      type: 'warning' as const,
      actionText: `Cancel ${trialEndingSoon.name}`,
      onClick: () => onCancelSub(trialEndingSoon.id),
    };
  } else if (safeToSpend < 100) {
    recommendedAction = {
      title: 'Freeze Non-Essential Impulse Spending',
      subtitle: `Liquidity buffer is low ($${safeToSpend.toFixed(2)}). Pause discretionary purchases until next paycheck.`,
      badge: '[SAL_WARNING_ORANGE] Low Safe-to-Spend Buffer',
      type: 'danger' as const,
      actionText: 'Review Subscriptions',
      onClick: () => {},
    };
  } else if (impulseCountToday >= 2) {
    recommendedAction = {
      title: 'Trigger 72-Hour Impulse Cooling Period',
      subtitle: `You logged ${impulseCountToday} impulse purchases today. Take a break before completing another transaction!`,
      badge: '[SAL_WARNING_ORANGE] Dopamine Spike Detected',
      type: 'warning' as const,
      actionText: 'Use Impulse Interrupt',
      onClick: () => setShowImpulseModal(true),
    };
  }

  // Handle Impulse Cooling Timer
  const startCoolingTimer = () => {
    setCoolingTimerActive(true);
    setCoolingSeconds(15);
    const interval = setInterval(() => {
      setCoolingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCoolingTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmImpulse = () => {
    if (!impulseTitle || !impulseAmount) return;
    onLogImpulse(impulseTitle, parseFloat(impulseAmount) || 0);
    setImpulseTitle('');
    setImpulseAmount('');
    setShowImpulseModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Single Actionable Decision Hero */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Executive Dysfunction Isolation Text */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-950/80 border border-cyan-700/60 rounded-full text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>DigiChar Executive Dysfunction Isolator v3.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
              <span>One Actionable Decision</span>
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Eliminates dense table fatigue and cognitive overload by narrowing focus down to a single recommended decision right now.
            </p>

            {/* Streak & Momentum Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono font-semibold text-emerald-400 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>8-Day Budget Streak</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono font-semibold text-cyan-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>0 Unwanted Trial Charges</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono font-semibold text-amber-300 flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-amber-400" />
                <span>Dopamine Friction: Protected</span>
              </div>
            </div>
          </div>

          {/* Actionable Focus Box */}
          <div className="bg-slate-950/90 border border-cyan-800/60 p-6 rounded-2xl flex flex-col justify-between min-w-[300px] shadow-2xl relative">
            <div className="space-y-3">
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Recommended Action</span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {recommendedAction.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {recommendedAction.subtitle}
              </p>

              <div className="pt-1">
                <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  recommendedAction.type === 'warning' 
                    ? 'bg-rose-950/90 text-rose-300 border-rose-700/80' 
                    : recommendedAction.type === 'danger'
                    ? 'bg-amber-950/90 text-amber-300 border-amber-700/80'
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                }`}>
                  {recommendedAction.badge}
                </span>
              </div>
            </div>

            <button
              onClick={recommendedAction.onClick}
              className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{recommendedAction.actionText}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Cognitive Hierarchy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Safe To Spend */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-semibold uppercase mb-2">
            <span>1. {safeToSpendLabel}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight my-1">
            ${safeToSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {safeToSpendHelp}
          </p>
        </div>

        {/* Step 2: Today's Budget */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-semibold uppercase mb-2">
            <span>2. Today's Allowance</span>
            <Timer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300 tracking-tight my-1">
            ${todayBudget.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Daily limit to keep month-end savings intact.
          </p>
        </div>

        {/* Step 3: Next Bill */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-semibold uppercase mb-2">
            <span>3. Next Bill Due</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-300 tracking-tight my-1 truncate">
            {nextSub ? nextSub.name : 'None'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>${nextSub ? nextSub.cost : 0}/mo</span>
            <span className="font-mono text-amber-400 font-bold">
              {daysToNextSub !== null ? `in ${daysToNextSub}d` : ''}
            </span>
          </p>
        </div>

        {/* Step 4: Impulse Guard */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:border-cyan-500/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-semibold uppercase mb-2">
              <span>4. Impulse Guard</span>
              <ShoppingBag className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-100 tracking-tight my-1">
              {impulseCountToday} Today
            </div>
            <p className="text-[11px] text-slate-400">
              Dopamine impulse logging tracker.
            </p>
          </div>
          <button
            onClick={() => setShowImpulseModal(true)}
            className="mt-3 py-1.5 px-3 bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/60 text-rose-200 text-[11px] font-mono font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Impulse Interrupt</span>
          </button>
        </div>
      </div>

      {/* Foolproof "Can I Afford This?" Instant Traffic Light Checker */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base flex items-center space-x-2">
                <span>Foolproof "Can I Afford This?" Instant Traffic Light</span>
              </h3>
              <p className="text-xs text-slate-400">
                Zero mental math. Type any price to get an instant Green / Yellow / Red verdict based on today's allowance.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-slate-950 text-cyan-300 border border-slate-800">
            Real-Time Protection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Inputs */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Item You Want To Buy</label>
              <input
                type="text"
                placeholder="e.g. Wireless Noise-Canceling Headphones"
                value={checkItemName}
                onChange={(e) => setCheckItemName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Item Cost ($ USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-xs">$</span>
                <input
                  type="number"
                  placeholder="49.99"
                  value={checkItemCost}
                  onChange={(e) => setCheckItemCost(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Traffic Light Verdict Output */}
          <div className={`p-5 rounded-xl border transition-all space-y-2 flex flex-col justify-center min-h-[120px] ${
            trafficVerdict.status === 'GREEN'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
              : trafficVerdict.status === 'YELLOW'
              ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/50'
              : trafficVerdict.status === 'RED'
              ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${trafficVerdict.badgeClass}`}>
                {trafficVerdict.status === 'IDLE' ? 'Ready to Check' : trafficVerdict.status}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Today's Buffer: ${todayBudget.toFixed(2)}
              </span>
            </div>

            <div className={`text-xl font-black font-mono ${trafficVerdict.colorClass}`}>
              {trafficVerdict.title}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {trafficVerdict.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Impulse Cooling Modal / Delay Interceptor */}
      {showImpulseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <div>
                <h3 className="text-lg font-bold text-slate-100">ADHD Impulse Interrupt</h3>
                <p className="text-xs text-slate-400">15-Second Cognitive Friction Cooling Period</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              Ask yourself: <span className="text-amber-300 font-semibold">"Will this purchase still bring me joy 72 hours from now, or is this a temporary dopamine spike?"</span>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical keyboard keycaps..."
                  value={impulseTitle}
                  onChange={(e) => setImpulseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Cost ($ USD)</label>
                <input
                  type="number"
                  placeholder="45.00"
                  value={impulseAmount}
                  onChange={(e) => setAmountClean(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {coolingTimerActive ? (
              <div className="p-4 bg-slate-950 border border-amber-800/50 rounded-xl text-center space-y-1">
                <div className="text-xs text-amber-300 font-mono font-bold uppercase">Cooling Timer Active</div>
                <div className="text-3xl font-black font-mono text-amber-400">{coolingSeconds}s</div>
                <div className="text-[10px] text-slate-400">Breathing interval to break impulse dopamine loop...</div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={startCoolingTimer}
                  className="flex-1 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-700/80 text-amber-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Start 15s Pause
                </button>
                <button
                  onClick={handleConfirmImpulse}
                  disabled={!impulseTitle || !impulseAmount}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Log Impulse
                </button>
              </div>
            )}

            <button
              onClick={() => setShowImpulseModal(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors pt-1 cursor-pointer"
            >
              Cancel & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function setAmountClean(val: string) {
    setImpulseAmount(val);
  }
};
