import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Check, 
  Zap, 
  RefreshCw, 
  Loader2, 
} from 'lucide-react';
import { BenchmarkItem } from '../types';
import { runAppDeconstruction } from '../services/desktopApi';

interface BenchmarkProps {
  benchmarks: BenchmarkItem[];
  onToggleBenchmark: (id: string) => void;
  onUpdateBenchmarks: (newBenchmarks: BenchmarkItem[]) => void;
}

export const AppDeconstructBenchmark: React.FC<BenchmarkProps> = ({
  benchmarks,
  onToggleBenchmark,
  onUpdateBenchmarks,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [focusQuery, setFocusQuery] = useState<string>('');

  const handleRunAppStudy = async () => {
    setLoading(true);
    try {
      const data = await runAppDeconstruction(
        focusQuery || 'ADHD friction reduction, subscription protection, and quick calculation',
      );
      const existingNames = new Set(benchmarks.map((benchmark) => benchmark.appName.toLowerCase()));
      const uniqueNew = data.benchmarks.filter((benchmark) => !existingNames.has(benchmark.appName.toLowerCase()));
      onUpdateBenchmarks([...uniqueNew, ...benchmarks]);
    } catch (err) {
      console.error('App study error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-800/50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-violet-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-violet-900/60 border border-violet-700/60 rounded-full text-violet-300 font-mono text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>Competitive Analysis & App Deconstruction Protocol</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            "Who does X best?" — Cherry-Picked Architecture
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            DigiChar runs a local desktop benchmark library for leading finance apps (Copilot, YNAB, Rocket Money, Splitwise, Monarch), deconstructs their signature capabilities, and adopts their best patterns directly into this ADHD-first workspace.
          </p>

          {/* AI Search input */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Focus benchmark area (e.g. 'debt snowball', 'receipt scan', 'shared budget')"
                value={focusQuery}
                onChange={(e) => setFocusQuery(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
            <button
              onClick={handleRunAppStudy}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Deconstructing Apps...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Run Desktop Study</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benchmarks.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              item.enabled
                ? 'bg-slate-900/90 border-slate-800 hover:border-violet-500/50 shadow-md'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-black text-slate-100">{item.appName}</span>
                  <div className="text-[11px] font-mono text-violet-300 font-semibold mt-0.5">
                    {item.bestAt}
                  </div>
                </div>

                {/* Module Toggle Switch */}
                <button
                  onClick={() => onToggleBenchmark(item.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 transition-all ${
                    item.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                  title="Toggle Feature Module in DigiChar"
                >
                  <Check className={`w-3 h-3 ${item.enabled ? 'opacity-100' : 'opacity-20'}`} />
                  <span>{item.enabled ? 'Adopted' : 'Disabled'}</span>
                </button>
              </div>

              {/* Killer Feature Badge */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Killer Feature</div>
                <div className="text-cyan-300 font-semibold">{item.killerFeature}</div>
              </div>

              {/* Deconstruction notes */}
              <p className="text-slate-300 text-xs leading-relaxed">
                <span className="font-bold text-slate-200">Deconstruction: </span>
                {item.deconstruction}
              </p>

              {/* Cherry picked lesson */}
              <div className="p-2.5 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs space-y-1">
                <div className="font-bold text-indigo-300 text-[11px] flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cherry-Picked Design Lesson:</span>
                </div>
                <p className="text-slate-300 text-[11px]">{item.cherryPickedLesson}</p>
              </div>
            </div>

            {/* Implementation in DigiChar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[10px]">DigiChar Module:</span>
              <span className="font-bold font-mono text-emerald-400 text-[11px]">
                {item.implementedInDigiChar}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
