import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Tag, 
  Sparkles, 
  Utensils, 
  Home, 
  Car, 
  Repeat, 
  X,
  Loader2
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { smartCategorize } from '../services/desktopApi';

interface TransactionsManagerProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  quickEntryOpen?: boolean;
  onCloseQuickEntry?: () => void;
}

export const TransactionsManager: React.FC<TransactionsManagerProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  quickEntryOpen = false,
  onCloseQuickEntry,
}) => {
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(quickEntryOpen);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isImpulse, setIsImpulse] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [autoCategorizing, setAutoCategorizing] = useState<boolean>(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Sync quickEntryOpen prop
  React.useEffect(() => {
    if (quickEntryOpen) {
      setIsModalOpen(true);
    }
  }, [quickEntryOpen]);

  const handleTitleBlur = async () => {
    if (!title || title.trim().length < 3) return;
    setAutoCategorizing(true);
    try {
      const categorization = await smartCategorize(title, parseFloat(amount) || 0);
      setCategory(categorization.category);
      setAiTip(categorization.adhdTip);
    } catch (err) {
      console.error('Smart categorize call error:', err);
    } finally {
      setAutoCategorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddTransaction({
      title,
      amount: parseFloat(amount) || 0,
      type,
      category,
      date,
      frequency: 'one-time',
      isImpulse,
      notes
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setIsImpulse(false);
    setNotes('');
    setAiTip(null);
    setIsModalOpen(false);
    if (onCloseQuickEntry) onCloseQuickEntry();
  };

  // Filter Logic
  const filtered = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase()) || 
                          (tx.notes && tx.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(transactions.map((t) => t.category)))];

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'food': return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'housing': return <Home className="w-3.5 h-3.5 text-cyan-400" />;
      case 'transportation': return <Car className="w-3.5 h-3.5 text-indigo-400" />;
      case 'subscriptions': return <Repeat className="w-3.5 h-3.5 text-violet-400" />;
      case 'income': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Tag className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses, income, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                typeFilter === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-md transition-colors ${
                typeFilter === 'expense' ? 'bg-rose-900/50 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-md transition-colors ${
                typeFilter === 'income' ? 'bg-emerald-900/50 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] capitalize shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-700/60 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Transaction Activity History ({filtered.length})</span>
          <span>Amount</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No transactions match your search filter. Click "Add Entry" to record income or expense!
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 hover:bg-slate-800/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center ${
                    tx.type === 'income' 
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}>
                    {getCategoryIcon(tx.category)}
                  </div>

                  <div>
                    <div className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <span>{tx.title}</span>
                      {tx.isSubscription && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-violet-950 text-violet-300 border border-violet-800">
                          Sub
                        </span>
                      )}
                      {tx.isImpulse && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-700 font-bold flex items-center space-x-0.5">
                          <span>⚡ Impulse</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span className="text-slate-300">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 truncate max-w-xs">{tx.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-base font-black font-mono ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100 text-base">Quick Financial Entry</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseQuickEntry) onCloseQuickEntry();
                }}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Income / Expense Switch */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 font-bold">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                    type === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                    type === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Income</span>
                </button>
              </div>

              {/* Title with AI auto categorize on blur */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium flex items-center justify-between">
                  <span>Title / Source</span>
                  {autoCategorizing && (
                    <span className="text-cyan-400 text-[10px] flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>AI Smart Categorizing...</span>
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starbucks, Freelance Client, Rent, Trader Joes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="25.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Housing">Housing & Rent</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health & Wellness</option>
                    <option value="Income">Income & Paycheck</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Impulse Toggle */}
              <div className="flex items-center space-x-2 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg">
                <input
                  type="checkbox"
                  id="impulse-toggle"
                  checked={isImpulse}
                  onChange={(e) => setIsImpulse(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700 cursor-pointer"
                />
                <label htmlFor="impulse-toggle" className="text-xs font-semibold text-amber-200 cursor-pointer flex items-center space-x-1">
                  <span>⚡ Tag as Impulse Purchase</span>
                  <span className="text-[10px] text-amber-400 font-normal">(ADHD dopamine awareness tracking)</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional context or receipt details"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* AI Tip Banner */}
              {aiTip && (
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-800/60 rounded-lg text-cyan-200 text-[11px] flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{aiTip}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseQuickEntry) onCloseQuickEntry();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-500/20"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
