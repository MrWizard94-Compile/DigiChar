import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  Delete, 
  PlusCircle, 
  MinusCircle, 
  Clock, 
  Percent, 
  Sparkles,
  ArrowRight,
  PieChart,
  CalendarDays
} from 'lucide-react';
import { CalculatorTapeItem } from '../types';
import { ShuntingYardEngine } from '../engine/shuntingYard';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResultToTransaction: (amount: number, type: 'expense' | 'income') => void;
}

export const FinancialCalculator: React.FC<CalculatorProps> = ({
  isOpen,
  onClose,
  onApplyResultToTransaction,
}) => {
  const [display, setDisplay] = useState<string>('0');
  const [tape, setTape] = useState<CalculatorTapeItem[]>([
    {
      id: 'tape-1',
      expression: '120 + 45.50 + 18.99',
      result: 184.49,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: 'Grocery & supplies receipt'
    }
  ]);
  const [splitBreakdown, setSplitBreakdown] = useState<{ needs: number; wants: number; savings: number } | null>(null);

  if (!isOpen) return null;

  const handleNumClick = (val: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleOpClick = (op: string) => {
    const lastChar = display.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      setDisplay((prev) => prev.slice(0, -1) + op);
    } else {
      setDisplay((prev) => prev + ' ' + op + ' ');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setSplitBreakdown(null);
  };

  const handleBackspace = () => {
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else if (display.endsWith(' ')) {
      setDisplay((prev) => prev.slice(0, -3));
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const evaluateDisplayExpression = () => {
    const cleanExpr = display.replace(/×/g, '*').replace(/÷/g, '/');
    return ShuntingYardEngine.evaluate(cleanExpr, {
      rent: 1200,
      discretionary: 0.1,
      salary: 3500,
      sub_drain: 45
    });
  };

  const handleEvaluate = () => {
    try {
      const val = evaluateDisplayExpression();
      
      if (isNaN(val) || !isFinite(val)) {
        setDisplay('Error');
        return;
      }
      const roundVal = Math.round(val * 100) / 100;
      
      // Save to tape
      const newItem: CalculatorTapeItem = {
        id: 'tape-' + Date.now(),
        expression: display,
        result: roundVal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTape((prev) => [newItem, ...prev.slice(0, 14)]);
      setDisplay(roundVal.toString());
    } catch (err) {
      console.error("Shunting Yard Evaluation Error:", err);
      setDisplay('Error');
    }
  };

  const handlePercent = () => {
    try {
      const val = evaluateDisplayExpression();
      if (isNaN(val) || !isFinite(val)) {
        setDisplay('Error');
        return;
      }

      setDisplay((Math.round((val / 100) * 10000) / 10000).toString());
    } catch (err) {
      console.error("Percent conversion error:", err);
      setDisplay('Error');
    }
  };

  const currentNum = parseFloat(display) || 0;

  // 50/30/20 Rule helper
  const calculate503020 = () => {
    const val = currentNum;
    if (val <= 0) return;
    setSplitBreakdown({
      needs: Math.round(val * 0.50 * 100) / 100,
      wants: Math.round(val * 0.30 * 100) / 100,
      savings: Math.round(val * 0.20 * 100) / 100,
    });
  };

  // Add tax helper (+8.875%)
  const applyTax = (ratePercent: number) => {
    const val = currentNum;
    if (val <= 0) return;
    const withTax = Math.round(val * (1 + ratePercent / 100) * 100) / 100;
    setDisplay(withTax.toString());
  };

  // Add tip helper (+15%, +18%, +20%)
  const applyTip = (tipPercent: number) => {
    const val = currentNum;
    if (val <= 0) return;
    const withTip = Math.round(val * (1 + tipPercent / 100) * 100) / 100;
    setDisplay(withTip.toString());
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col justify-between select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm font-mono">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>Financial Tape Calculator</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Calculator Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Main Display Screen */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 shadow-inner">
          <div className="text-right text-xs font-mono text-slate-400 min-h-[18px] overflow-x-auto">
            {display}
          </div>
          <div className="text-right text-3xl font-mono font-bold text-cyan-300 tracking-wider truncate">
            {display}
          </div>
        </div>

        {/* Action Buttons to Send to Transaction Entry */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onApplyResultToTransaction(currentNum, 'expense')}
            disabled={currentNum <= 0}
            className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all disabled:opacity-40 cursor-pointer"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Add as Expense</span>
          </button>
          <button
            onClick={() => onApplyResultToTransaction(currentNum, 'income')}
            disabled={currentNum <= 0}
            className="py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all disabled:opacity-40 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add as Income</span>
          </button>
        </div>

        {/* Quick Budgeting Tools */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span className="flex items-center space-x-1">
              <PieChart className="w-3 h-3 text-indigo-400" />
              <span>ADHD Budget Quick Tools</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={calculate503020}
              className="py-1.5 px-2 bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 rounded text-[11px] font-medium flex items-center justify-between"
            >
              <span>50/30/20 Rule</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </button>
            <button
              onClick={() => {
                const daysInMonth = 30;
                const allowance = Math.round((currentNum / daysInMonth) * 100) / 100;
                setDisplay(allowance.toString());
              }}
              className="py-1.5 px-2 bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 rounded text-[11px] font-medium flex items-center justify-between"
            >
              <span>Daily Allowance</span>
              <CalendarDays className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          {/* Quick Tip / Tax adjustments */}
          <div className="flex items-center space-x-1 pt-1">
            <span className="text-[10px] text-slate-500 font-mono">Tips:</span>
            {[15, 18, 20].map((tip) => (
              <button
                key={tip}
                onClick={() => applyTip(tip)}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
              >
                +{tip}%
              </button>
            ))}
            <span className="text-[10px] text-slate-500 font-mono ml-1">Tax:</span>
            <button
              onClick={() => applyTax(8.875)}
              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
            >
              +8.88%
            </button>
          </div>

          {/* 50/30/20 Breakdown Display if generated */}
          {splitBreakdown && (
            <div className="mt-2 p-2 bg-indigo-950/80 rounded border border-indigo-800/60 space-y-1 text-[11px] font-mono animate-in fade-in duration-150">
              <div className="text-indigo-300 font-bold border-b border-indigo-800/50 pb-1">
                Income Allocation Breakdown:
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Needs (50%):</span>
                <span className="text-cyan-300 font-bold">${splitBreakdown.needs}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Wants (30%):</span>
                <span className="text-amber-300 font-bold">${splitBreakdown.wants}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Savings (20%):</span>
                <span className="text-emerald-300 font-bold">${splitBreakdown.savings}</span>
              </div>
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-sm">
          <button
            onClick={handleClear}
            className="py-2.5 bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 font-bold rounded-lg border border-rose-800/50 transition-colors"
          >
            AC
          </button>
          <button
            onClick={handleBackspace}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg flex items-center justify-center transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={handlePercent}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-lg transition-colors"
          >
            <Percent className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleOpClick('/')}
            className="py-2.5 bg-cyan-900/50 hover:bg-cyan-900/80 text-cyan-300 font-bold rounded-lg border border-cyan-700/50 transition-colors"
          >
            ÷
          </button>

          {['7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumClick(n)}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOpClick('*')}
            className="py-2.5 bg-cyan-900/50 hover:bg-cyan-900/80 text-cyan-300 font-bold rounded-lg border border-cyan-700/50 transition-colors"
          >
            ×
          </button>

          {['4', '5', '6'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumClick(n)}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOpClick('-')}
            className="py-2.5 bg-cyan-900/50 hover:bg-cyan-900/80 text-cyan-300 font-bold rounded-lg border border-cyan-700/50 transition-colors"
          >
            -
          </button>

          {['1', '2', '3'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumClick(n)}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOpClick('+')}
            className="py-2.5 bg-cyan-900/50 hover:bg-cyan-900/80 text-cyan-300 font-bold rounded-lg border border-cyan-700/50 transition-colors"
          >
            +
          </button>

          <button
            onClick={() => handleNumClick('0')}
            className="col-span-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors"
          >
            0
          </button>
          <button
            onClick={() => handleNumClick('.')}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors"
          >
            .
          </button>
          <button
            onClick={handleEvaluate}
            className="py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black rounded-lg shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            =
          </button>
        </div>

        {/* Tape History */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Calculation Tape History</span>
            </span>
            {tape.length > 0 && (
              <button
                onClick={() => setTape([])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear Tape
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {tape.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-3">No recent calculations</p>
            ) : (
              tape.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDisplay(item.result.toString())}
                  className="p-2 bg-slate-950/80 hover:bg-slate-800/80 rounded border border-slate-800 flex items-center justify-between cursor-pointer transition-colors group text-xs font-mono"
                >
                  <div>
                    <div className="text-slate-400 text-[11px]">{item.expression}</div>
                    <div className="text-[10px] text-slate-600">{item.timestamp}</div>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-cyan-300 group-hover:text-cyan-200">
                    <span>${item.result}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
