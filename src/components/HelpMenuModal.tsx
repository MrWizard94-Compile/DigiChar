import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  BookOpen, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  Flame, 
  Database, 
  Landmark, 
  TrendingUp, 
  Sparkles,
  Search,
  CheckCircle2,
  Command
} from 'lucide-react';

interface HelpMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculator: () => void;
  onOpenAiAdvisor: () => void;
  onOpenDataExport: () => void;
}

export const HelpMenuModal: React.FC<HelpMenuModalProps> = ({
  isOpen,
  onClose,
  onOpenCalculator,
  onOpenAiAdvisor,
  onOpenDataExport,
}) => {
  const [activeHelpCategory, setActiveHelpCategory] = useState<'overview' | 'modules' | 'adhd' | 'calculator' | 'shortcuts' | 'faq'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How is "Safe-To-Spend" calculated?',
      a: 'Safe-To-Spend = (Total Income - Total Expenses) - Monthly Subscription Drain. It represents your true unencumbered liquidity without delusion.'
    },
    {
      q: 'What is the 15-Second Impulse Intercept Timer?',
      a: 'When you feel a sudden dopamine urge to buy something non-essential, triggering Impulse Interrupt forces a 15-second breathing cooling period. This breaks executive dysfunction impulse loops before you spend.'
    },
    {
      q: 'Is my financial data secure?',
      a: 'Yes! DigiChar is an offline-first desktop OS. Your ledger data resides locally in desktop WebView storage and export files without sending private bank statements to third-party databases.'
    },
    {
      q: 'How does the Shunting Yard Calculator Engine work?',
      a: 'The tape calculator evaluates infix math expressions safely using a custom Shunting Yard parser without risky eval(). It supports financial variables like rent, salary, and sub_drain.'
    },
    {
      q: 'What does ADHD Focus Mode do?',
      a: 'Focus Mode hides peripheral charts, secondary widgets, and distracting lists, isolating purely the single actionable decision and safe daily allowance.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full h-[650px] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
                <span>DigiChar Desktop Engine Documentation & Help Center</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Production Roadmap v3.0 • Executive Dysfunction Manual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Category Navigation */}
          <div className="w-48 bg-slate-950 border-r border-slate-800/80 p-3 space-y-1 font-mono text-xs flex-shrink-0">
            <button
              onClick={() => setActiveHelpCategory('overview')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Core Vision</span>
            </button>

            <button
              onClick={() => setActiveHelpCategory('adhd')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'adhd'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Brain className="w-4 h-4 text-amber-400" />
              <span>ADHD OS Layer</span>
            </button>

            <button
              onClick={() => setActiveHelpCategory('modules')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'modules'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Modules Guide</span>
            </button>

            <button
              onClick={() => setActiveHelpCategory('calculator')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'calculator'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Tape Engine</span>
            </button>

            <button
              onClick={() => setActiveHelpCategory('shortcuts')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'shortcuts'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Command className="w-4 h-4 text-violet-400" />
              <span>Shortcuts</span>
            </button>

            <button
              onClick={() => setActiveHelpCategory('faq')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeHelpCategory === 'faq'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>FAQ & Support</span>
            </button>

            <div className="pt-6 border-t border-slate-800/80 mt-4 space-y-2">
              <button
                onClick={() => { onClose(); onOpenAiAdvisor(); }}
                className="w-full py-1.5 px-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-[10px] font-bold border border-cyan-800/80 flex items-center justify-center space-x-1 transition-all cursor-pointer"
              >
                <Brain className="w-3 h-3 text-cyan-400" />
                <span>Launch AI Advisor</span>
              </button>

              <button
                onClick={() => { onClose(); onOpenDataExport(); }}
                className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-800 flex items-center justify-center space-x-1 transition-all cursor-pointer"
              >
                <Database className="w-3 h-3 text-slate-400" />
                <span>Backup Ledger</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* 1. Core Vision */}
            {activeHelpCategory === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-800/60 rounded-2xl space-y-2">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>DigiChar Core Philosophy: SOUL IS LAW</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    DigiChar is designed specifically for neurodivergent individuals and anyone suffering from financial decision fatigue. Instead of forcing you to decipher dense, spreadsheet-style multi-row accounting tables, DigiChar isolates <strong>ONE actionable decision</strong> at a time.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Core Operating Rules
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="font-bold text-slate-200 text-sm">1. Eliminate Dense Tables</div>
                      <p className="text-slate-400 text-[11px]">No wall-of-numbers. Financial metrics are chunked into high-salience visual cards.</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="font-bold text-slate-200 text-sm">2. High-Salience Tokens</div>
                      <p className="text-slate-400 text-[11px]">Chromatic signals (<span className="text-emerald-400 font-mono">[SAL_OPTIMAL]</span>, <span className="text-amber-400 font-mono">[SAL_WARNING]</span>) alert you immediately.</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="font-bold text-slate-200 text-sm">3. Deterministic Local Math</div>
                      <p className="text-slate-400 text-[11px]">All financial expressions run locally with cents-level rounding and no cloud delay.</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="font-bold text-slate-200 text-sm">4. Impulse Protection</div>
                      <p className="text-slate-400 text-[11px]">Cognitive friction interceptors prevent sudden impulsive spending regret.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ADHD OS Layer */}
            {activeHelpCategory === 'adhd' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-amber-400" />
                    <span>Executive Function Support Systems</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Designed to alleviate executive dysfunction, short-term memory overload, and dopamine-driven impulse purchasing.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-950 border border-amber-800/60 rounded-2xl space-y-2">
                    <div className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>15-Second Cognitive Friction Cooling Period</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Clicking <strong>Impulse Interrupt</strong> launches a mandatory 15-second timer. Use this time to breathe and ask yourself: <i>"Is this purchase fulfilling a genuine long-term need, or am I seeking a momentary dopamine spike?"</i>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Daily Safe Allowance</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Safe Daily Allowance divides your remaining unencumbered monthly liquidity by 30 days, giving you a clear, achievable daily spending target.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Modules Guide */}
            {activeHelpCategory === 'modules' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h4 className="text-base font-bold text-emerald-300 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>Module Capabilities Matrix</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-cyan-300 text-sm flex items-center space-x-2">
                      <Landmark className="w-4 h-4 text-cyan-400" />
                      <span>Accounts & Envelopes</span>
                    </div>
                    <p className="text-slate-300">Track checking, savings, cash, credit cards, and zero-based budget envelope limits.</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-emerald-300 text-sm flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Subscription Radar</span>
                    </div>
                    <p className="text-slate-300">Monitors active trials, renewal countdowns, cancelation steps, and retention discount strategies.</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>Deal Discovery Engine</span>
                    </div>
                    <p className="text-slate-300">Scans retailer DOM nodes for promo codes and retention discounts across Adobe, Steam, Spotify, and more.</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-300 text-sm flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      <span>Trends & Cashflow Velocity</span>
                    </div>
                    <p className="text-slate-300">Visualizes weekly vs monthly spending deltas, category allocations, and impulse purchase spikes.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tape Calculator */}
            {activeHelpCategory === 'calculator' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 bg-slate-950 border border-indigo-800/60 rounded-2xl space-y-2">
                  <h4 className="text-base font-bold text-indigo-300 flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <span>Shunting Yard Tape Engine</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The embedded desktop calculator converts mathematical expressions into Reverse Polish Notation (RPN) using Dijkstra's Shunting Yard algorithm.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-mono font-bold text-slate-400 uppercase">Supported Variables:</div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-bold">
                      salary = $3,500
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-rose-300 font-bold">
                      rent = $1,200
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-bold">
                      discretionary = 0.10
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-indigo-300 font-bold">
                      sub_drain = $45
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-mono text-slate-400 mb-1">Sample Expression:</div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400">
                      salary - rent - sub_drain * 1.05
                    </div>
                  </div>

                  <button
                    onClick={() => { onClose(); onOpenCalculator(); }}
                    className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Open Calculator Tape</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. Shortcuts */}
            {activeHelpCategory === 'shortcuts' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h4 className="text-base font-bold text-violet-300 flex items-center space-x-2">
                  <Command className="w-5 h-5 text-violet-400" />
                  <span>Desktop Navigation & Controls</span>
                </h4>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Quick Log Expense</span>
                    <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-cyan-400 font-bold">Top Header "+ Log"</span>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Open Tape Calculator</span>
                    <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-cyan-400 font-bold">Top Header "Calc"</span>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Toggle ADHD Focus Mode</span>
                    <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold">Top Header "Focus"</span>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Backup / Restore Ledger</span>
                    <span className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-emerald-400 font-bold">Top Header "Database Icon"</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. FAQ */}
            {activeHelpCategory === 'faq' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search FAQ questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-3">
                  {filteredFaqs.map((f, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                      <div className="text-xs font-bold text-cyan-300 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{f.q}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
