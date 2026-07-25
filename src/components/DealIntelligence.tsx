import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ShieldCheck, 
  Flame, 
  Building2,
  RefreshCw,
} from 'lucide-react';
import { ScrapedDeal } from '../types';
import { scrapeDeals } from '../services/desktopApi';

export const INITIAL_DEALS: ScrapedDeal[] = [
  { retailTarget: 'Adobe Creative Cloud', promoCode: 'SAVE50STUDENT', description: '50% off Student & Teacher All Apps Plan', absoluteConfidenceScore: 95 },
  { retailTarget: 'Spotify Premium', promoCode: 'DUO3MONTHSFREE', description: '3 Months Free Spotify Duo Trial for New Accounts', absoluteConfidenceScore: 90 },
  { retailTarget: 'Steam Summer Sale', promoCode: 'BUNDLE2026', description: '20% off Indie Publisher Bundle Pack', absoluteConfidenceScore: 85 },
  { retailTarget: 'Microsoft 365', promoCode: 'MSFAMILY30', description: '30% off Annual Family Subscription Upgrade', absoluteConfidenceScore: 88 },
  { retailTarget: 'Amazon Prime', promoCode: 'PRIMEDISCOUNT', description: 'EBT / Qualifying Assistance 50% Monthly Rate', absoluteConfidenceScore: 92 },
  { retailTarget: 'Costco Wholesale', promoCode: 'NEWJOIN50', description: '$50 Shop Card with Executive Membership Renewal', absoluteConfidenceScore: 82 },
];

export const RETAILER_LIST = [
  { name: 'Adobe', category: 'Software', icon: '🎨' },
  { name: 'Spotify', category: 'Music', icon: '🎵' },
  { name: 'Steam', category: 'Gaming', icon: '🎮' },
  { name: 'Microsoft', category: 'Productivity', icon: '💻' },
  { name: 'Amazon', category: 'Shopping', icon: '📦' },
  { name: 'Epic Games', category: 'Gaming', icon: '⚡' },
  { name: 'Costco', category: 'Groceries', icon: '🛒' },
  { name: 'Humble Bundle', category: 'Gaming & Books', icon: '📚' },
];

export const DealIntelligence: React.FC = () => {
  const [deals, setDeals] = useState<ScrapedDeal[]>(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchingAi, setSearchingAi] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunDOMScraper = async () => {
    setSearchingAi(true);
    try {
      const mockDOM = `
        <div data-deal-node="true" data-merchant="Adobe" data-code="DISCOUNT2026" data-desc="20% Off Annual Renewal" class="verified-badge"></div>
        <div data-deal-node="true" data-merchant="Steam" data-code="SUMMERPROMO" data-desc="$10 Off $50 Order" class="verified-badge"></div>
      `;
      const parsedDeals = await scrapeDeals(mockDOM);
      if (parsedDeals.length) {
        setDeals((prev) => [...parsedDeals, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingAi(false);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.retailTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.promoCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRetailer = selectedRetailer === 'All' || deal.retailTarget.toLowerCase().includes(selectedRetailer.toLowerCase());
    return matchesSearch && matchesRetailer;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/80 border border-amber-700/60 rounded-full text-[11px] font-mono text-amber-300 font-semibold uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Phase 6 — Multi-Retailer Deal & Coupon Extraction Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Subscription Deal Discovery Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Headless DOM extraction parser that scans major retailers and subscription platforms for retention discounts and active promo codes.
          </p>
        </div>

        <button
          onClick={handleRunDOMScraper}
          disabled={searchingAi}
          className="relative z-10 py-3 px-5 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 stroke-[3] ${searchingAi ? 'animate-spin' : ''}`} />
          <span>{searchingAi ? 'Scanning DOM...' : 'Execute DOM Scraper'}</span>
        </button>
      </div>

      {/* Retailer Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedRetailer('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedRetailer === 'All'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          ⚡ All Retailers
        </button>

        {RETAILER_LIST.map((r) => (
          <button
            key={r.name}
            onClick={() => setSelectedRetailer(r.name)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              selectedRetailer === r.name
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{r.icon}</span>
            <span>{r.name}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search promo codes, deals, student discounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
        />
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeals.map((deal, idx) => (
          <div
            key={idx}
            className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg hover:border-amber-500/50 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{deal.retailTarget}</span>
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{deal.absoluteConfidenceScore}% Confidence</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {deal.description}
              </p>
            </div>

            {/* Promo Code Box */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                {deal.promoCode}
              </div>

              <button
                onClick={() => handleCopyCode(deal.promoCode)}
                className="py-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[11px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer"
              >
                {copiedCode === deal.promoCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
