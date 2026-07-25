import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { AlertTriangle, PieChart as PieIcon, BarChart3, Calendar } from 'lucide-react';
import { Transaction, ADHDPreferences } from '../types';

interface TrendsProps {
  transactions: Transaction[];
  preferences: ADHDPreferences;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',
  Housing: '#06b6d4',
  Subscriptions: '#8b5cf6',
  Transportation: '#6366f1',
  Utilities: '#3b82f6',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Income: '#10b981',
  Other: '#64748b'
};

export const TrendsAndAnalytics: React.FC<TrendsProps> = ({ transactions, preferences }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  // Compute total monthly income vs expense
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashflow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Monthly / Weekly Trend Data
  const trendData = [
    { name: 'W1', income: 850, expense: 420 },
    { name: 'W2', income: 1200, expense: 380 },
    { name: 'W3', income: 600, expense: 510 },
    { name: 'W4', income: 1400, expense: 480 },
  ];

  // Category Pie Chart Data
  const categoryMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
    color: CATEGORY_COLORS[cat] || '#64748b'
  }));

  // ADHD Budget Limit Calculations
  const weeklyExpense = totalExpense / 4; // approximate
  const isWeeklyOver = weeklyExpense > preferences.weeklyBudgetLimit;
  const isMonthlyOver = totalExpense > preferences.monthlyBudgetLimit;

  const weeklyPercent = Math.min(100, Math.round((weeklyExpense / preferences.weeklyBudgetLimit) * 100));
  const monthlyPercent = Math.min(100, Math.round((totalExpense / preferences.monthlyBudgetLimit) * 100));

  return (
    <div className="space-y-6">
      {/* ADHD Budget Threshold Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Meter */}
        <div className={`p-4 rounded-xl border transition-all ${
          isWeeklyOver 
            ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-900/20' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Weekly Spend vs Limit</span>
            </span>
            <span className="font-mono text-slate-400">
              ${weeklyExpense.toFixed(0)} / ${preferences.weeklyBudgetLimit}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isWeeklyOver ? 'bg-rose-500' : weeklyPercent > 85 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono mt-2">
            <span className={isWeeklyOver ? 'text-rose-300 font-bold flex items-center space-x-1' : 'text-slate-500'}>
              {isWeeklyOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 inline" />}
              <span>{isWeeklyOver ? 'Weekly Limit Exceeded!' : `${100 - weeklyPercent}% budget cushion left`}</span>
            </span>
            <span className="text-slate-400 font-bold">{weeklyPercent}% used</span>
          </div>
        </div>

        {/* Monthly Meter */}
        <div className={`p-4 rounded-xl border transition-all ${
          isMonthlyOver 
            ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-900/20' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Monthly Budget Cap</span>
            </span>
            <span className="font-mono text-slate-400">
              ${totalExpense.toFixed(0)} / ${preferences.monthlyBudgetLimit}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMonthlyOver ? 'bg-rose-500' : monthlyPercent > 85 ? 'bg-amber-400' : 'bg-indigo-400'
              }`}
              style={{ width: `${monthlyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono mt-2">
            <span className={isMonthlyOver ? 'text-rose-300 font-bold flex items-center space-x-1' : 'text-slate-500'}>
              {isMonthlyOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 inline" />}
              <span>{isMonthlyOver ? 'Monthly Threshold Alert!' : `Savings Velocity: ${savingsRate}%`}</span>
            </span>
            <span className="text-slate-400 font-bold">{monthlyPercent}% used</span>
          </div>
        </div>
      </div>

      {/* Main Cashflow Trend Chart */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Cashflow Velocity & Weekly Trends</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing income momentum vs recurring expense burn
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeframe === 'weekly' ? 'bg-cyan-900/60 text-cyan-200 font-bold' : 'text-slate-400'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeframe === 'monthly' ? 'bg-cyan-900/60 text-cyan-200 font-bold' : 'text-slate-400'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="income" name="Income ($)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Expense ($)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Categories Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <span>Expense Category Weight</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health Signals */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
            ADHD Financial Health Signals
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Net Monthly Cashflow</div>
                <div className="text-[10px] text-slate-500 font-mono">Income minus Expenses</div>
              </div>
              <div className={`font-mono font-bold text-sm ${netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netCashflow >= 0 ? '+' : ''}${netCashflow.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Savings Rate Ratio</div>
                <div className="text-[10px] text-slate-500 font-mono">Target: {'>'} 20%</div>
              </div>
              <div className="font-mono font-bold text-sm text-cyan-300">
                {savingsRate}%
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Subscription Ratio</div>
                <div className="text-[10px] text-slate-500 font-mono">Recurring / Total Expenses</div>
              </div>
              <div className="font-mono font-bold text-sm text-indigo-300">
                {totalExpense > 0 ? Math.round((transactions.filter(t => t.isSubscription).reduce((a,b) => a+b.amount,0) / totalExpense) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
