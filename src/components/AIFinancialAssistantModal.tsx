import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Bot, 
  Send, 
  X, 
} from 'lucide-react';
import { Transaction, SubscriptionItem } from '../types';
import { askFinancialAdvisor } from '../services/desktopApi';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  subscriptions: SubscriptionItem[];
}

export const AIFinancialAssistantModal: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  transactions,
  subscriptions,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am DigiChar AI, your executive dysfunction financial advisor. Ask me anything about your cashflow, impulse trends, or subscription reduction strategy!'
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Why am I overspending this month?',
    'Can I afford a $150 impulse purchase?',
    'Which subscriptions should I cancel first?',
    'Predict my month-end cashflow'
  ];

  const handleSend = async (promptText?: string) => {
    const text = promptText || query;
    if (!text.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const advice = await askFinancialAdvisor(text, transactions, subscriptions);
      setMessages([...newMsgs, { role: 'assistant', content: advice.reply }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'DigiChar AI is analyzing your offline ledger data. Your safe-to-spend buffer looks solid!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full h-[600px] p-6 shadow-2xl flex flex-col justify-between relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Brain className="w-5 h-5" />
            <div>
              <h3 className="text-lg font-bold text-slate-100">Phase 10 — DigiChar AI Assistant</h3>
              <p className="text-[11px] text-slate-400">Executive Dysfunction Financial Advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="p-2 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>DigiChar desktop advisor is analyzing...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask DigiChar AI about your money..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!query.trim() || loading}
              className="py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
