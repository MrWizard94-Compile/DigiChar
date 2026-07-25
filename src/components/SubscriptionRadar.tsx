import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Tag, 
  CheckCircle2, 
  Copy, 
  Check, 
  TrendingDown, 
  Info,
  DollarSign,
  Loader2,
  X
} from 'lucide-react';
import { SubscriptionItem, CouponSearchResult } from '../types';
import { searchCoupons } from '../services/desktopApi';

interface SubscriptionRadarProps {
  subscriptions: SubscriptionItem[];
  onAddSubscription: (sub: Omit<SubscriptionItem, 'id'>) => void;
  onRemoveSubscription: (id: string) => void;
  onUpdateSubscriptionStatus: (id: string, status: SubscriptionItem['status']) => void;
}

export const SubscriptionRadar: React.FC<SubscriptionRadarProps> = ({
  subscriptions,
  onAddSubscription,
  onRemoveSubscription,
  onUpdateSubscriptionStatus,
}) => {
  const [selectedSubForSearch, setSelectedSubForSearch] = useState<SubscriptionItem | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [dealResults, setDealResults] = useState<CouponSearchResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Subscription Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCost, setNewCost] = useState<string>('');
  const [newCycle, setNewCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [newIsTrial, setNewIsTrial] = useState<boolean>(false);
  const [newTrialDays, setNewTrialDays] = useState<string>('7');
  const [newCategory, setNewCategory] = useState<string>('Software');

  // Total recurring expense metrics
  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'canceling' || sub.status === 'paused') return acc;
    return acc + (sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost);
  }, 0);

  const totalAnnualCost = totalMonthlyCost * 12;
  const trialCount = subscriptions.filter((s) => s.isTrial && s.status === 'trial').length;

  const handleSearchDeals = async (sub: SubscriptionItem) => {
    setSelectedSubForSearch(sub);
    setSearching(true);
    setDealResults(null);

    try {
      const dealData = await searchCoupons(sub.name, sub.cost, sub.billingCycle);
      setDealResults(dealData);
    } catch (err) {
      console.error('Error fetching deal search:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCost) return;

    const costNum = parseFloat(newCost) || 0;
    const days = parseInt(newTrialDays) || 7;
    const nextDate = new Date(Date.now() + (newIsTrial ? days : 30) * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    onAddSubscription({
      name: newName,
      cost: costNum,
      billingCycle: newCycle,
      nextBillingDate: nextDate,
      isTrial: newIsTrial,
      trialEndsAt: newIsTrial ? nextDate : undefined,
      category: newCategory,
      status: newIsTrial ? 'trial' : 'active',
      notes: newIsTrial ? `${days}-day trial active` : 'Active subscription'
    });

    // Reset Form
    setNewName('');
    setNewCost('');
    setNewIsTrial(false);
    setShowAddModal(false);
  };

  // Helper calculation for trial countdown
  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Monthly Recurring Drain</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-100">
            ${totalMonthlyCost.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Annual Projection: ${totalAnnualCost.toFixed(2)}/yr
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Subscriptions</span>
            <Tag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-300">
            {subscriptions.length} <span className="text-xs text-slate-400 font-normal">services</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {subscriptions.filter(s => s.status === 'active').length} active, {subscriptions.filter(s => s.status === 'canceling').length} pending cancel
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/50 p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
            <span>Free Trial Expiration Radar</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-200">
            {trialCount} <span className="text-xs font-normal">trials on clock</span>
          </div>
          <div className="text-[11px] text-amber-400/80 font-mono">
            Auto-alert prevents accidental renewal charges
          </div>
        </div>
      </div>

      {/* Main Subscriptions List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Subscriptions & Free Trial Radar</span>
          </h2>
          <p className="text-xs text-slate-400">
            ADHD Protection: Never pay full price or forget to cancel a free trial before billing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm shadow-cyan-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Track Subscription</span>
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((sub) => {
          const daysLeft = getDaysRemaining(sub.trialEndsAt || sub.nextBillingDate);
          const isUrgent = sub.isTrial && daysLeft !== null && daysLeft <= 3;

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-xl border transition-all ${
                isUrgent
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-900/20'
                  : sub.status === 'canceling'
                  ? 'bg-slate-900/60 border-slate-800 opacity-75'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-100 text-sm">{sub.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      sub.isTrial 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : sub.status === 'canceling'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {sub.isTrial ? 'Trial' : sub.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Category: {sub.category}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black font-mono text-cyan-300">
                    ${sub.cost.toFixed(2)}
                    <span className="text-xs text-slate-400 font-normal">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Next: {sub.nextBillingDate}
                  </div>
                </div>
              </div>

              {/* Trial Countdown Warning Banner if active */}
              {sub.isTrial && (
                <div className={`mt-3 p-2 rounded-lg text-xs font-mono flex items-center justify-between ${
                  isUrgent ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold' : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <AlertCircle className={`w-4 h-4 ${isUrgent ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                    <span>
                      {daysLeft !== null && daysLeft <= 0 
                        ? 'Trial Ends Today!' 
                        : `Trial Ends in ${daysLeft} days (${sub.trialEndsAt})`}
                    </span>
                  </div>
                  <button
                    onClick={() => onUpdateSubscriptionStatus(sub.id, 'canceling')}
                    className="text-[10px] underline text-amber-300 hover:text-amber-100"
                  >
                    Mark Canceling
                  </button>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleSearchDeals(sub)}
                  className="px-2.5 py-1 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-700/50 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Find Coupons & Deals</span>
                </button>

                <div className="flex items-center space-x-2">
                  {sub.cancellationUrl && (
                    <a
                      href={sub.cancellationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title="Direct Cancel Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => onRemoveSubscription(sub.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Remove Tracker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Search Modal */}
      {selectedSubForSearch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">
                    AI Deal & Coupon Finder: {selectedSubForSearch.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Desktop deal strategy, retention tips & lower-cost alternatives
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubForSearch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {searching ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-mono">Building local promo code, retention, and discount strategy...</p>
              </div>
            ) : dealResults ? (
              <div className="space-y-4">
                {/* Savings summary badge */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                    <TrendingDown className="w-4 h-4" />
                    <span>Estimated Annual Potential Savings:</span>
                  </div>
                  <div className="text-base font-black font-mono text-emerald-400">
                    ${dealResults.estimatedAnnualSavings}/yr
                  </div>
                </div>

                {/* Promo Codes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Verified Promo & Discount Codes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dealResults.promoCodes.map((pc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-cyan-300 text-xs flex items-center space-x-1">
                            <span>{pc.code}</span>
                            {pc.verified && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{pc.description}</div>
                        </div>
                        <button
                          onClick={() => handleCopyCode(pc.code)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono flex items-center space-x-1"
                        >
                          {copiedCode === pc.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Tactics & Retention Sequence */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Tactical Retention & Discount Tips
                  </h4>
                  <div className="space-y-1.5">
                    {dealResults.savingsTactics.map((st, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span>{st.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {st.impact} Impact
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{st.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retention Hack */}
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Retention Hack Note:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {dealResults.retentionDiscountTip}
                  </p>
                </div>

                {/* Cheaper Alternatives */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Cheaper / Open-Source Alternatives
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dealResults.cheaperAlternatives.map((alt, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{alt.name}</span>
                          <span className="text-emerald-400 font-mono">{alt.cost}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{alt.keyAdvantage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSub} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">Track New Subscription or Trial</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Service / App Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Adobe, Gym, ChatGPT"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.99"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Billing Cycle</label>
                  <select
                    value={newCycle}
                    onChange={(e) => setNewCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Software">Software & AI</option>
                  <option value="Entertainment">Entertainment & Streaming</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Utilities">Utilities & Services</option>
                  <option value="Education">Education & Books</option>
                </select>
              </div>

              {/* Free Trial Toggle */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsTrial}
                    onChange={(e) => setNewIsTrial(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span className="font-bold text-amber-300">This is a Free Trial</span>
                </label>

                {newIsTrial && (
                  <div>
                    <label className="block text-slate-400 mb-1">Trial Length (Days)</label>
                    <input
                      type="number"
                      value={newTrialDays}
                      onChange={(e) => setNewTrialDays(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-500/20"
              >
                Start Protection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
