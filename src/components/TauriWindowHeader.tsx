import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { 
  Calculator, 
  Sparkles, 
  Plus, 
  Cpu, 
  SlidersHorizontal, 
  Focus,
  Maximize2,
  Minus,
  X,
  Zap,
  TrendingUp,
  Tag,
  ShieldCheck,
  Landmark,
  Database,
  Brain,
  Flame,
  HelpCircle
} from 'lucide-react';
import { ADHDPreferences } from '../types';
import { isDesktopRuntime } from '../services/desktopApi';

interface HeaderProps {
  preferences: ADHDPreferences;
  onUpdatePreferences: (updated: Partial<ADHDPreferences>) => void;
  onOpenCalculator: () => void;
  onQuickAddTransaction: () => void;
  onOpenPreferences: () => void;
  onOpenAiAdvisor: () => void;
  onOpenDataExport: () => void;
  onOpenHelp: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalBalance: number;
  netMonthlyCashflow: number;
}

export const TauriWindowHeader: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenCalculator,
  onQuickAddTransaction,
  onOpenPreferences,
  onOpenAiAdvisor,
  onOpenDataExport,
  onOpenHelp,
  activeTab,
  setActiveTab,
  totalBalance,
  netMonthlyCashflow,
}) => {
  const runWindowAction = (action: 'close' | 'minimize' | 'toggleMaximize') => {
    if (!isDesktopRuntime()) {
      return;
    }

    const currentWindow = getCurrentWindow();
    if (action === 'close') {
      void currentWindow.close().catch((error) => console.error('Unable to close DigiChar window:', error));
    } else if (action === 'minimize') {
      void currentWindow.minimize().catch((error) => console.error('Unable to minimize DigiChar window:', error));
    } else {
      void currentWindow.toggleMaximize().catch((error) => console.error('Unable to maximize DigiChar window:', error));
    }
  };

  const startWindowDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !isDesktopRuntime()) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [data-no-drag="true"]')) {
      return;
    }

    void getCurrentWindow().startDragging().catch((error) => console.error('Unable to drag DigiChar window:', error));
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800/80 text-slate-100 select-none sticky top-0 z-40 backdrop-blur-md">
      {/* Title Bar (Tauri / Native Desktop Look) */}
      <div
        className="h-9 px-3 flex items-center justify-between bg-slate-950/80 border-b border-slate-800/60 text-xs"
        onPointerDown={startWindowDrag}
      >
        {/* Window controls (Mac style dots) */}
        <div className="flex items-center space-x-2" data-no-drag="true">
          <div className="flex space-x-1.5 items-center group">
            <button
              type="button"
              onClick={() => runWindowAction('close')}
              className="w-3 h-3 rounded-full bg-rose-500/90 inline-flex items-center justify-center text-[8px] text-slate-950 font-bold opacity-80 group-hover:opacity-100 transition-opacity"
              title="Close"
            >
              <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              type="button"
              onClick={() => runWindowAction('minimize')}
              className="w-3 h-3 rounded-full bg-amber-500/90 inline-flex items-center justify-center text-[8px] text-slate-950 font-bold opacity-80 group-hover:opacity-100 transition-opacity"
              title="Minimize"
            >
              <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              type="button"
              onClick={() => runWindowAction('toggleMaximize')}
              className="w-3 h-3 rounded-full bg-emerald-500/90 inline-flex items-center justify-center text-[8px] text-slate-950 font-bold opacity-80 group-hover:opacity-100 transition-opacity"
              title="Maximize"
            >
              <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          <div className="h-3 w-px bg-slate-800 mx-1" />

          {/* App Branding Badge */}
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold tracking-wide">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-100 font-bold text-xs font-mono">DigiChar</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
              Roadmap v3.0 Desktop Engine
            </span>
          </div>
        </div>

        {/* Center - Balance summary banner */}
        <div className="hidden lg:flex items-center space-x-4 bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-800 font-mono text-[11px]">
          <span className="text-slate-400">Net Cashflow:</span>
          <span className={`font-bold ${netMonthlyCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netMonthlyCashflow >= 0 ? '+' : ''}${netMonthlyCashflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Total Vault:</span>
          <span className="text-cyan-300 font-bold">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Right - Quick Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* AI Advisor Launcher */}
          <button
            onClick={onOpenAiAdvisor}
            className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[11px] font-mono font-bold flex items-center space-x-1 hover:bg-cyan-900/80 transition-all cursor-pointer"
            title="DigiChar AI Financial Advisor"
          >
            <Brain className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Data Export/Import Launcher */}
          <button
            onClick={onOpenDataExport}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Data Layer Backup & Import"
          >
            <Database className="w-3.5 h-3.5" />
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => onUpdatePreferences({ focusMode: !preferences.focusMode })}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer ${
              preferences.focusMode 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30 ring-1 ring-amber-400' 
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
            title="ADHD Focus Mode: Hides extra clutter"
          >
            <Focus className="w-3 h-3" />
            <span className="hidden sm:inline">{preferences.focusMode ? 'Focus ON' : 'Focus'}</span>
          </button>

          {/* Calculator Quick Launch */}
          <button
            onClick={onOpenCalculator}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer"
            title="Open Tape Calculator"
          >
            <Calculator className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Calc</span>
          </button>

          {/* Preferences Settings */}
          <button
            onClick={onOpenPreferences}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="ADHD Preferences & Budget Limits"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Help Center Menu */}
          <button
            onClick={onOpenHelp}
            className="p-1 rounded text-cyan-400 hover:text-cyan-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="DigiChar Desktop Engine Help & Executive Manual"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Tab Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2 bg-slate-900">
        <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800 overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            <span>Executive Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>Accounts & Envelopes</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-indigo-300" />
            <span>Expenses & Income</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Subscriptions Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'deals'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Deal Discovery</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>Trends & Cashflow</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>Who Does X Best?</span>
          </button>
        </div>

        {/* Quick Add Expense Button */}
        <button
          onClick={onQuickAddTransaction}
          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Quick Entry</span>
        </button>
      </div>
    </div>
  );
};
