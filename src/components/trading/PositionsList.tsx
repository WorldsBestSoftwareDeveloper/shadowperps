"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, TrendingUp, TrendingDown, Loader2, Share2, X, ChevronRight } from "lucide-react";

interface Position {
  id:          string;
  direction:   "long" | "short";
  size:        number;
  collateral:  number;
  leverage:    number;
  entryPrice:  number;
  markPrice:   number;
  status:      "open" | "liquidated" | "closed";
  signalEmitted: boolean;
  openedAt:    string;
}

// Mock positions for devnet demo
const MOCK_POSITIONS: Position[] = [
  {
    id:             "pos_abc123",
    direction:      "long",
    size:           50000,
    collateral:     10000,
    leverage:       5,
    entryPrice:     50341,
    markPrice:      52341,
    status:         "open",
    signalEmitted:  false,
    openedAt:       "2 mins ago",
  },
  {
    id:             "pos_def456",
    direction:      "short",
    size:           20000,
    collateral:     2000,
    leverage:       10,
    entryPrice:     53200,
    markPrice:      52341,
    status:         "open",
    signalEmitted:  true,
    openedAt:       "1 hour ago",
  },
];

const MOCK_HISTORY: Position[] = [
  {
    id:             "pos_ghi789",
    direction:      "long",
    size:           10000,
    collateral:     1000,
    leverage:       10,
    entryPrice:     48000,
    markPrice:      52000,
    status:         "closed",
    signalEmitted:  false,
    openedAt:       "Yesterday",
  },
];

interface Props {
  walletAddress?: string;
  activeTab: "positions" | "history";
}

export function PositionsList({ activeTab }: Props) {
  const [checking,  setChecking]  = useState<string | null>(null);
  const [emitting,  setEmitting]  = useState<string | null>(null);
  const [closing,   setClosing]   = useState<string | null>(null);
  const [positions, setPositions] = useState(MOCK_POSITIONS);

  const items = activeTab === "positions"
    ? positions.filter(p => p.status === "open")
    : MOCK_HISTORY;

  const handleCheckLiquidation = async (id: string) => {
    setChecking(id);
    const t = toast.loading("Encrypting oracle price…");
    await new Promise(r => setTimeout(r, 1500));
    toast.loading("Arcium MPC checking liquidation threshold…", { id: t });
    await new Promise(r => setTimeout(r, 4000));
    toast.success("Not liquidated ✓ (result decrypted from MPC)", { id: t, duration: 5000 });
    setChecking(null);
  };

  const handleEmitSignal = async (id: string) => {
    setEmitting(id);
    const t = toast.loading("Computing directional signal via MPC…");
    await new Promise(r => setTimeout(r, 5000));
    toast.success("Signal emitted: LONG 📈 (only direction revealed)", { id: t, duration: 5000 });
    setPositions(prev => prev.map(p => p.id === id ? { ...p, signalEmitted: true } : p));
    setEmitting(null);
  };

  const handleClose = async (id: string) => {
    setClosing(id);
    const t = toast.loading("Closing position…");
    await new Promise(r => setTimeout(r, 2500));
    toast.success("Position closed · Collateral returned", { id: t, duration: 4000 });
    setPositions(prev => prev.filter(p => p.id !== id));
    setClosing(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 bg-arcium-800/60 rounded-xl flex items-center justify-center mx-auto mb-3 border border-arcium-700/30">
          <Lock className="w-5 h-5 text-arcium-600" />
        </div>
        <p className="text-sm text-arcium-500">
          {activeTab === "positions" ? "No open positions" : "No trade history"}
        </p>
        <p className="text-xs text-arcium-600 mt-1">Open a position to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(pos => {
        const pnl      = (pos.markPrice - pos.entryPrice) / pos.entryPrice * pos.size * (pos.direction === "long" ? 1 : -1);
        const pnlPct   = (pnl / pos.collateral) * 100;
        const isProfit = pnl >= 0;

        return (
          <div key={pos.id} className="bg-arcium-900/60 border border-arcium-700/30 rounded-xl p-4 hover:border-arcium-600/40 transition-all">
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {pos.direction === "long"
                  ? <span className="tag-long flex items-center gap-1"><TrendingUp className="w-3 h-3" />LONG</span>
                  : <span className="tag-short flex items-center gap-1"><TrendingDown className="w-3 h-3" />SHORT</span>
                }
                <span className="text-xs text-arcium-400 font-mono">{pos.leverage}×</span>
                <span className="tag-encrypted flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />Private
                </span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-mono font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                  {isProfit ? "+" : ""}${pnl.toFixed(2)}
                </div>
                <div className={`text-xs font-mono ${isProfit ? "text-green-600" : "text-red-600"}`}>
                  {isProfit ? "+" : ""}{pnlPct.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                ["Size",       `$${(pos.size/1000).toFixed(0)}k`,          false],
                ["Entry",      `$${pos.entryPrice.toLocaleString()}`,       false],
                ["Liq. Price", "🔒 Encrypted",                              true],
              ].map(([label, value, enc]) => (
                <div key={String(label)}>
                  <p className="text-[10px] text-arcium-600 uppercase tracking-wider">{label}</p>
                  <p className={`text-xs font-mono mt-0.5 ${enc ? "text-arcium-500" : "text-arcium-200"}`}>
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>

            {/* Collateral bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-arcium-600 mb-1">
                <span>Collateral: ${pos.collateral.toLocaleString()} USDC</span>
                <span>{pos.openedAt}</span>
              </div>
              <div className="h-1 bg-arcium-800/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isProfit ? "bg-green-500/60" : "bg-red-500/60"}`}
                  style={{ width: `${Math.min(100, Math.abs(pnlPct) * 2)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            {pos.status === "open" && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleCheckLiquidation(pos.id)}
                  disabled={!!checking}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-arcium-800/60 hover:bg-arcium-700/60 border border-arcium-700/30 hover:border-arcium-500/40 text-arcium-300 text-xs font-display font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {checking === pos.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Lock className="w-3 h-3" />
                  }
                  Check Liq.
                </button>
                <button
                  onClick={() => handleEmitSignal(pos.id)}
                  disabled={!!emitting || pos.signalEmitted}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-arcium-800/60 hover:bg-arcium-700/60 border border-arcium-700/30 hover:border-arcium-500/40 text-arcium-300 text-xs font-display font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {emitting === pos.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Share2 className="w-3 h-3" />
                  }
                  {pos.signalEmitted ? "Signal Emitted ✓" : "Emit Signal"}
                </button>
                <button
                  onClick={() => handleClose(pos.id)}
                  disabled={!!closing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-800/40 border border-red-800/40 hover:border-red-600/40 text-red-400 text-xs font-display font-medium rounded-lg transition-all disabled:opacity-50 ml-auto"
                >
                  {closing === pos.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <X className="w-3 h-3" />
                  }
                  Close
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
