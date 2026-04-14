"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { Lock, TrendingUp, TrendingDown, Info, Loader2, ChevronDown } from "lucide-react";

interface Props {
  markPrice: number;
}

const LEVERAGE_PRESETS = [1, 2, 5, 10, 20, 50, 100];

export function TradingPanel({ markPrice }: Props) {
  const { publicKey } = useWallet();

  const [direction,  setDirection]  = useState<"long" | "short">("long");
  const [collateral, setCollateral] = useState("");
  const [leverage,   setLeverage]   = useState(5);
  const [loading,    setLoading]    = useState(false);
  const [showInfo,   setShowInfo]   = useState(false);

  const collateralNum = parseFloat(collateral) || 0;
  const positionSize  = collateralNum * leverage;
  const liqPrice      = direction === "long"
    ? markPrice * (1 - 1 / leverage)
    : markPrice * (1 + 1 / leverage);
  const liqDistance   = Math.abs(((liqPrice - markPrice) / markPrice) * 100);

  const handleOpenPosition = async () => {
    if (!publicKey) return;
    if (collateralNum <= 0) {
      toast.error("Enter a collateral amount");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Encrypting trade inputs…");

    try {
      // Simulate the MPC computation flow for devnet demo
      await new Promise(r => setTimeout(r, 1500));
      toast.loading("Submitting to Solana…", { id: toastId });
      await new Promise(r => setTimeout(r, 2000));
      toast.loading("Arcium MPC computing privately…", { id: toastId });
      await new Promise(r => setTimeout(r, 4000));
      toast.loading("Finalising on-chain…", { id: toastId });
      await new Promise(r => setTimeout(r, 1500));

      toast.success(
        `${direction.toUpperCase()} position opened! Size: $${positionSize.toLocaleString()}`,
        { id: toastId, duration: 5000 }
      );
      setCollateral("");
    } catch (e: any) {
      toast.error(e?.message || "Transaction failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden sticky top-24">
      {/* Header tabs */}
      <div className="flex border-b border-arcium-700/40">
        <button
          onClick={() => setDirection("long")}
          className={`flex-1 py-3.5 text-sm font-display font-semibold flex items-center justify-center gap-2 transition-all ${
            direction === "long"
              ? "bg-green-900/30 text-green-400 border-b-2 border-green-500"
              : "text-arcium-500 hover:text-arcium-300"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Long
        </button>
        <button
          onClick={() => setDirection("short")}
          className={`flex-1 py-3.5 text-sm font-display font-semibold flex items-center justify-center gap-2 transition-all ${
            direction === "short"
              ? "bg-red-900/30 text-red-400 border-b-2 border-red-500"
              : "text-arcium-500 hover:text-arcium-300"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Short
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Privacy notice */}
        <div
          className="flex items-start gap-2.5 p-3 bg-arcium-800/40 rounded-xl border border-arcium-700/30 cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Lock className="w-3.5 h-3.5 text-arcium-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-arcium-400 font-medium">
              Trade inputs encrypted by Arcium MPC
            </p>
            {showInfo && (
              <p className="text-xs text-arcium-500 mt-1.5 leading-relaxed">
                Your entry price, size, leverage, and liquidation threshold are encrypted in your browser
                using x25519 ECDH before being sent to Solana. Arcium's MPC cluster processes them
                without ever seeing plaintext values.
              </p>
            )}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-arcium-600 shrink-0 mt-0.5 transition-transform ${showInfo ? "rotate-180" : ""}`} />
        </div>

        {/* Market price */}
        <div>
          <p className="label">Mark Price</p>
          <div className="input-field flex items-center justify-between cursor-not-allowed opacity-70">
            <span className="font-mono">${markPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-xs text-arcium-500">Oracle</span>
          </div>
        </div>

        {/* Collateral */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label">Collateral (USDC)</label>
            <button className="text-xs text-arcium-500 hover:text-arcium-300 transition-colors font-mono">
              Balance: 10,000.00
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={collateral}
              onChange={e => setCollateral(e.target.value)}
              className="input-field pr-16"
            />
            <button
              onClick={() => setCollateral("10000")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-arcium-400 hover:text-arcium-200 font-display font-semibold transition-colors"
            >
              MAX
            </button>
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map(a => (
              <button
                key={a}
                onClick={() => setCollateral(String(a))}
                className="flex-1 py-1.5 text-xs font-mono bg-arcium-800/60 hover:bg-arcium-700/60 text-arcium-400 hover:text-arcium-200 border border-arcium-700/30 rounded-lg transition-colors"
              >
                {a >= 1000 ? `${a/1000}k` : a}
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label">Leverage</label>
            <span className="text-sm font-display font-bold text-arcium-200">{leverage}×</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={leverage}
            onChange={e => setLeverage(parseInt(e.target.value))}
            className="w-full accent-arcium-500 cursor-pointer"
          />
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {LEVERAGE_PRESETS.map(l => (
              <button
                key={l}
                onClick={() => setLeverage(l)}
                className={`px-2 py-1 text-xs font-mono rounded-lg border transition-colors ${
                  leverage === l
                    ? "bg-arcium-600/60 border-arcium-500/60 text-arcium-200"
                    : "bg-arcium-800/40 border-arcium-700/30 text-arcium-500 hover:text-arcium-300"
                }`}
              >
                {l}×
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        {collateralNum > 0 && (
          <div className="space-y-2.5 py-4 border-t border-b border-arcium-700/30">
            {[
              ["Position Size",      `$${positionSize.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, false],
              ["Entry Price",        `$${markPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, false],
              ["Liq. Price (est.)",  "🔒 Computed privately by MPC", true],
              ["Liq. Distance",      `~${liqDistance.toFixed(1)}% from entry`, false],
              ["Fees (est.)",        "~0.10 USDC", false],
            ].map(([k, v, encrypted]) => (
              <div key={String(k)} className="flex items-center justify-between">
                <span className="text-xs text-arcium-500">{k}</span>
                <span className={`text-xs font-mono ${encrypted ? "text-arcium-400 flex items-center gap-1" : "text-arcium-200"}`}>
                  {encrypted && <Lock className="w-2.5 h-2.5" />}
                  {v}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleOpenPosition}
          disabled={loading || !collateral}
          className={`w-full py-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            direction === "long"
              ? "bg-green-700/80 hover:bg-green-600/80 text-green-100 border border-green-600/50"
              : "bg-red-800/80 hover:bg-red-700/80 text-red-100 border border-red-700/50"
          }`}
          style={!loading && collateral ? {
            boxShadow: direction === "long"
              ? "0 0 20px rgba(34,197,94,0.25)"
              : "0 0 20px rgba(239,68,68,0.25)"
          } : {}}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing via Arcium…
            </>
          ) : (
            <>
              {direction === "long" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              Open {leverage}× {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-arcium-600 font-mono">
          Devnet only · No real funds · Arcium MPC
        </p>
      </div>
    </div>
  );
}
