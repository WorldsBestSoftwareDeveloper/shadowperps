"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerStats {
  markPrice:    number;
  change24h:    number;
  openInterest: number;
  funding:      number;
  volume24h:    number;
}

export function MarketTicker({ stats }: { stats: TickerStats }) {
  const isUp = stats.change24h >= 0;
  return (
    <div className="border-b border-arcium-800/50 bg-arcium-950/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-display font-bold text-arcium-100">
            ${stats.markPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center gap-1 text-sm font-mono ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isUp ? "+" : ""}{stats.change24h}%
          </span>
        </div>
        <div className="h-4 w-px bg-arcium-700/50 shrink-0" />
        {[
          ["24h Volume",    `$${(stats.volume24h / 1e6).toFixed(2)}M`],
          ["Open Interest", `$${(stats.openInterest / 1e6).toFixed(2)}M`],
          ["Funding",       `${stats.funding > 0 ? "+" : ""}${(stats.funding * 100).toFixed(4)}%`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-arcium-600">{label}</span>
            <span className="text-xs font-mono text-arcium-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
