import React, { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Landmark, 
  TrendingUp, 
  Plus, 
  PiggyBank, 
  Target, 
  Trash2,
} from 'lucide-react';
import { FinancialAccount, BudgetEnvelope, FinancialGoal } from '../types';

export const INITIAL_ACCOUNTS: FinancialAccount[] = [
  { id: 'acc-1', name: 'Primary Checking', type: 'checking', balance: 2850.00, accountNumberLast4: '4821', color: 'cyan' },
  { id: 'acc-2', name: 'High-Yield Savings', type: 'savings', balance: 5400.00, accountNumberLast4: '9012', color: 'emerald' },
  { id: 'acc-3', name: 'Emergency Cash Vault', type: 'cash', balance: 350.00, color: 'amber' },
  { id: 'acc-4', name: 'Rewards Credit Card', type: 'credit', balance: -340.00, accountNumberLast4: '1105', color: 'rose' },
  { id: 'acc-5', name: 'Index Growth Portfolio', type: 'investment', balance: 2100.00, accountNumberLast4: '7741', color: 'indigo' },
];

export const INITIAL_ENVELOPES: BudgetEnvelope[] = [
  { id: 'env-1', category: 'Housing', monthlyLimit: 1500, spent: 1450, color: 'cyan' },
  { id: 'env-2', category: 'Food & Groceries', monthlyLimit: 500, spent: 384, color: 'emerald' },
  { id: 'env-3', category: 'Subscriptions', monthlyLimit: 120, spent: 95, color: 'indigo' },
  { id: 'env-4', category: 'Transportation', monthlyLimit: 200, spent: 110, color: 'amber' },
  { id: 'env-5', category: 'Health & Fitness', monthlyLimit: 150, spent: 65, color: 'rose' },
  { id: 'env-6', category: 'Entertainment', monthlyLimit: 150, spent: 140, color: 'violet' },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  { id: 'goal-1', title: '3-Month Emergency Fund', targetAmount: 6000, currentAmount: 4500, targetDate: '2026-12-31', category: 'Emergency', icon: 'ShieldCheck' },
  { id: 'goal-2', title: 'Japan Tech Trip 2027', targetAmount: 2500, currentAmount: 1150, targetDate: '2027-04-15', category: 'Vacation', icon: 'Plane' },
  { id: 'goal-3', title: 'Credit Card Balance Payoff', targetAmount: 1000, currentAmount: 660, targetDate: '2026-09-30', category: 'Debt', icon: 'CheckCircle2' },
];

export const AccountsAndEnvelopes: React.FC = () => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(INITIAL_ACCOUNTS);
  const [envelopes] = useState<BudgetEnvelope[]>(INITIAL_ENVELOPES);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);

  // New Account Modal State
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<FinancialAccount['type']>('checking');
  const [newAccBalance, setNewAccBalance] = useState('');

  // Quick Deposit to Goal State
  const [depositAmount, setDepositAmount] = useState<{ [goalId: string]: string }>({});

  const handleAddAccount = () => {
    if (!newAccName || !newAccBalance) return;
    const acc: FinancialAccount = {
      id: 'acc-' + Date.now(),
      name: newAccName,
      type: newAccType,
      balance: parseFloat(newAccBalance) || 0,
      color: newAccType === 'savings' ? 'emerald' : newAccType === 'credit' ? 'rose' : 'cyan',
    };
    setAccounts((prev) => [...prev, acc]);
    setNewAccName('');
    setNewAccBalance('');
    setShowAddAccount(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDepositGoal = (goalId: string) => {
    const amt = parseFloat(depositAmount[goalId] || '0');
    if (amt <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amt) } : g
      )
    );

    setDepositAmount((prev) => ({ ...prev, [goalId]: '' }));
  };

  const totalAccountValue = accounts.reduce((acc, a) => acc + a.balance, 0);
  const handleAccountTypeChange = (value: string) => {
    if (
      value === 'checking' ||
      value === 'savings' ||
      value === 'cash' ||
      value === 'credit' ||
      value === 'loan' ||
      value === 'investment'
    ) {
      setNewAccType(value);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-950/80 border border-cyan-700/60 rounded-full text-[11px] font-mono text-cyan-300 font-semibold uppercase mb-2">
            <Landmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phase 1 — Financial Core & Envelope Allocation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Accounts, Budget Envelopes & Goals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-based envelope budgeting eliminates passive account balance delusion by assigning every dollar a explicit job.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Net Account Portfolio</div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              ${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button
            onClick={() => setShowAddAccount(true)}
            className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Connected Financial Accounts ({accounts.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg relative group hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl bg-slate-950 border ${
                    acc.type === 'checking' ? 'border-cyan-700/80 text-cyan-400' :
                    acc.type === 'savings' ? 'border-emerald-700/80 text-emerald-400' :
                    acc.type === 'credit' ? 'border-rose-700/80 text-rose-400' :
                    'border-amber-700/80 text-amber-400'
                  }`}>
                    {acc.type === 'checking' && <Building2 className="w-4 h-4" />}
                    {acc.type === 'savings' && <PiggyBank className="w-4 h-4" />}
                    {acc.type === 'credit' && <CreditCard className="w-4 h-4" />}
                    {acc.type === 'cash' && <Wallet className="w-4 h-4" />}
                    {acc.type === 'investment' && <TrendingUp className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{acc.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {acc.type} {acc.accountNumberLast4 ? `(•${acc.accountNumberLast4})` : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAccount(acc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Balance</span>
                <span className={`text-lg font-black font-mono ${acc.balance < 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Envelope Budgeting Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Monthly Envelope Budgeting Limits</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Zero-Based Envelope Allocation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {envelopes.map((env) => {
            const percent = Math.min(100, Math.round((env.spent / env.monthlyLimit) * 100));
            const isOver = env.spent > env.monthlyLimit;

            return (
              <div
                key={env.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-100">{env.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isOver ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {percent}% Spent
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-xl font-black text-slate-100">${env.spent}</span>
                  <span className="text-xs text-slate-400">Limit: ${env.monthlyLimit}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : percent > 85 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Remaining</span>
                  <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ${Math.max(0, env.monthlyLimit - env.spent)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Goals Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Target Savings & Debt Payoff Goals</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const goalPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

            return (
              <div
                key={goal.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">{goal.category}</span>
                    <span className="text-xs font-mono text-slate-400">{goalPercent}%</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-100">{goal.title}</h4>

                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-2xl font-black text-amber-300">
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">Target: ${goal.targetAmount.toLocaleString()}</span>
                  </div>

                  {/* Goal Progress Bar */}
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Goal Deposit Form */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                  <input
                    type="number"
                    placeholder="+$50"
                    value={depositAmount[goal.id] || ''}
                    onChange={(e) => setDepositAmount({ ...depositAmount, [goal.id]: e.target.value })}
                    className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleDepositGoal(goal.id)}
                    className="flex-1 py-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Add Deposit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Connect New Account</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chase Freedom Unlimited"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Account Type</label>
                <select
                  value={newAccType}
                  onChange={(e) => handleAccountTypeChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="cash">Cash Vault</option>
                  <option value="credit">Credit Card</option>
                  <option value="loan">Loan / Mortgage</option>
                  <option value="investment">Investment Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Starting Balance ($ USD)</label>
                <input
                  type="number"
                  placeholder="1250.00"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowAddAccount(false)}
                className="flex-1 py-2 bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold rounded-xl hover:text-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
