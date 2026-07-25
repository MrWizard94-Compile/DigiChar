import React, { useState } from 'react';
import { 
  Upload, 
  Database, 
  Check, 
  FileText, 
  FileSpreadsheet, 
  Trash2,
  X
} from 'lucide-react';
import { Transaction, SubscriptionItem, ADHDPreferences } from '../types';

interface DataExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  subscriptions: SubscriptionItem[];
  preferences: ADHDPreferences;
  onImportData: (transactions: Transaction[], subscriptions: SubscriptionItem[]) => void;
  onResetData: () => void;
}

export const DataExportImportModal: React.FC<DataExportImportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  subscriptions,
  preferences,
  onImportData,
  onResetData,
}) => {
  const [importedJsonText, setImportedJsonText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Export JSON
  const handleExportJson = () => {
    const data = {
      transactions,
      subscriptions,
      preferences,
      exportedAt: new Date().toISOString(),
      appVersion: '3.0.0-DigiChar'
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digichar_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('JSON Export downloaded successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Handle Export CSV
  const handleExportCsv = () => {
    let csv = 'ID,Title,Amount,Type,Category,Date,Frequency,IsSubscription,IsImpulse,Notes\n';
    transactions.forEach((t) => {
      csv += `"${t.id}","${t.title.replace(/"/g, '""')}",${t.amount},"${t.type}","${t.category}","${t.date}","${t.frequency}",${t.isSubscription || false},${t.isImpulse || false},"${(t.notes || '').replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digichar_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('CSV Export downloaded successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Handle Import JSON
  const handleImportJson = () => {
    try {
      setErrMsg(null);
      const parsed = JSON.parse(importedJsonText) as unknown;
      if (!isRecord(parsed)) {
        setErrMsg('Invalid JSON format. Expected an object with transactions or subscriptions arrays.');
        return;
      }

      const importedTransactions = Array.isArray(parsed.transactions)
        ? parsed.transactions.filter(isTransaction)
        : [];
      const importedSubscriptions = Array.isArray(parsed.subscriptions)
        ? parsed.subscriptions.filter(isSubscriptionItem)
        : [];

      if (Array.isArray(parsed.transactions) || Array.isArray(parsed.subscriptions)) {
        onImportData(importedTransactions, importedSubscriptions);
        setSuccessMsg('Data restored & imported successfully!');
        setImportedJsonText('');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrMsg('Invalid JSON format. Expected transactions or subscriptions array.');
      }
    } catch {
      setErrMsg('Malformed JSON text. Please check syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Database className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-100">Phase 8 — Data Layer Import & Export</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errMsg && (
          <div className="p-3 bg-rose-950/90 border border-rose-700/80 text-rose-300 text-xs font-mono font-bold rounded-xl">
            {errMsg}
          </div>
        )}

        {/* Download Buttons */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-slate-400 uppercase font-bold">1. Export Application Backup</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJson}
              className="py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-mono font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Data</span>
            </button>
          </div>
        </div>

        {/* Import JSON Text */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-400 uppercase font-bold">2. Import / Restore JSON Backup</label>
          <textarea
            rows={4}
            placeholder='Paste JSON export content here...'
            value={importedJsonText}
            onChange={(e) => setImportedJsonText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleImportJson}
            disabled={!importedJsonText.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4 stroke-[3]" />
            <span>Restore From JSON</span>
          </button>
        </div>

        {/* Reset State */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              if (confirm("Reset all local DigiChar data to initial demo state?")) {
                onResetData();
                onClose();
              }
            }}
            className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset To Default Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTransaction(value: unknown): value is Transaction {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.amount === 'number' &&
    (value.type === 'income' || value.type === 'expense') &&
    typeof value.category === 'string' &&
    typeof value.date === 'string' &&
    (value.frequency === 'one-time' ||
      value.frequency === 'weekly' ||
      value.frequency === 'monthly' ||
      value.frequency === 'yearly')
  );
}

function isSubscriptionItem(value: unknown): value is SubscriptionItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.cost === 'number' &&
    (value.billingCycle === 'monthly' || value.billingCycle === 'yearly') &&
    typeof value.nextBillingDate === 'string' &&
    typeof value.isTrial === 'boolean' &&
    typeof value.category === 'string' &&
    (value.status === 'active' ||
      value.status === 'trial' ||
      value.status === 'canceling' ||
      value.status === 'paused')
  );
}
