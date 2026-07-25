import React from 'react';
import { SlidersHorizontal, X, Focus, Sparkles, Check } from 'lucide-react';
import { ADHDPreferences } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ADHDPreferences;
  onUpdatePreferences: (updated: Partial<ADHDPreferences>) => void;
}

const THEME_PRESETS: ReadonlyArray<{
  id: ADHDPreferences['theme'];
  name: string;
  color: string;
}> = [
  { id: 'cyber-tauri', name: 'Cyber Tauri Dark', color: 'from-cyan-500 to-indigo-500' },
  { id: 'emerald-dark', name: 'Emerald Vault', color: 'from-emerald-500 to-teal-500' },
  { id: 'violet-nord', name: 'Violet Nord', color: 'from-violet-500 to-purple-500' },
  { id: 'amber-warm', name: 'Amber Warm Dusk', color: 'from-amber-500 to-orange-500' },
];

export const ADHDPreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">ADHD Ergonomics & Settings</h3>
              <p className="text-xs text-slate-400">Minimize cognitive friction & customize visual budgets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold">Desktop Aesthetic Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdatePreferences({ theme: t.id })}
                  className={`p-3 rounded-xl border text-left font-mono font-bold flex items-center justify-between transition-all ${
                    preferences.theme === t.id
                      ? 'bg-slate-950 border-cyan-500 shadow-sm shadow-cyan-500/20 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${t.color}`} />
                    <span className="text-[11px]">{t.name}</span>
                  </div>
                  {preferences.theme === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Limits */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider">
              Budget Threshold Warnings
            </h4>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-slate-300 mb-1 font-mono">
                  <span>Weekly Limit ($):</span>
                  <span className="font-bold text-cyan-300">${preferences.weeklyBudgetLimit}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={preferences.weeklyBudgetLimit}
                  onChange={(e) => onUpdatePreferences({ weeklyBudgetLimit: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1 font-mono">
                  <span>Monthly Limit Cap ($):</span>
                  <span className="font-bold text-indigo-300">${preferences.monthlyBudgetLimit}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={preferences.monthlyBudgetLimit}
                  onChange={(e) => onUpdatePreferences({ monthlyBudgetLimit: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div className="flex items-center space-x-2">
                <Focus className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-bold text-slate-200">ADHD Focus Mode</div>
                  <div className="text-[10px] text-slate-400">Hides peripheral clutter for hyperfocus sessions</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.focusMode}
                onChange={(e) => onUpdatePreferences({ focusMode: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-bold text-slate-200">Haptic Visual Feedback</div>
                  <div className="text-[10px] text-slate-400">Visual flash indicators on savings milestones & entries</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.hapticVisuals}
                onChange={(e) => onUpdatePreferences({ hapticVisuals: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-slate-200">Plain English Mode (Zero Jargon)</div>
                  <div className="text-[10px] text-slate-400">Replaces financial terms with clear, simple everyday words</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!preferences.plainEnglishMode}
                onChange={(e) => onUpdatePreferences({ plainEnglishMode: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
