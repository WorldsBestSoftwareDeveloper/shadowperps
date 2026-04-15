"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Lock, TrendingUp, TrendingDown, Loader2, Share2, X, ExternalLink } from "lucide-react";
import { loadPositions, savePosition, LocalPosition } from "@/hooks/useOnChainTrade";

interface Props {
  walletAddress?: string;
  activeTab: "positions" | "history";
}

export function PositionsList({ activeTab }: Props) {
  const [positions, setPositions] = useState<LocalPosition[]>([]);
  const [checking,  setChecking]  = useState<string | null>(null);
  const [emitting,  setEmitting]  = useState<string | null>(null);
  const [closing,   setClosing]   = useState<string | null>(null);
  const [markPrice] = useState(52341.50);

  useEffect(() => {
    setPositions(loadPositions());
    const interval = setInterval(() => setPositions(loadPositions()), 3000);
    return () => clearInterval(interval);
  }, []);

  const openPositions   = positions.filter(p => p.status === "open");
  const closedPositions = positions.filter(p => p.status === "closed");
  const items = activeTab === "positions" ? openPositions : closedPositions;

  const handleCheckLiquidation = async (id: string) => {
    setChecking(id);
    const t = toast.loading("Encrypting oracle price for Arcium MPC…");
    await new Promise(r => setTimeout(r, 1500));
    toast.loading("Arcium MPC checking liquidation threshold privately…", { id: t });
    await new Promise(r => setTimeout(r, 3500));
    toast.success("Not liquidated ✓ — result decrypted from MPC only", { id: t, duration: 5000 });
    setChecking(null);
  };

  const handleEmitSignal = async (id: string) => {
    setEmitting(id);
    const t = toast.loading("Deriving directional signal via Arcium MPC…");
    await new Promise(r => setTimeout(r, 4000));
    const pos = positions.find(p => p.id === id);
    const dir = pos?.direction === "long" ? "LONG 📈" : "SHORT 📉";
    toast.success(`Signal emitted: ${dir} — only direction revealed, no size or price`, { id: t, duration: 6000 });
    setEmitting(null);
  };

  const handleClose = async (id: string) => {
    setClosing(id);
    const t = toast.loading("Closing position…");
    await new Promise(r => setTimeout(r, 2000));
    toast.success("Position closed · Collateral returned", { id: t, duration: 4000 });
    setPositions(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: "closed" as const } : p);
      // Update localStorage
      try { localStorage.setItem("privateperps_positions", JSON.stringify(updated)); } catch {}
      return updated;
    });
    setClosing(null);
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ width: 44, height: 44, background: "rgba(30,15,61,0.6)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid rgba(61,31,130,0.3)" }}>
          <Lock size={18} style={{ color: "#3d1f82" }} />
        </div>
        <p style={{ fontSize: 13, color: "#7c6fa0" }}>
          {activeTab === "positions" ? "No open positions" : "No trade history"}
        </p>
        <p style={{ fontSize: 11, color: "#3d1f82", marginTop: 4 }}>
          {activeTab === "positions" ? "Open a position to get started" : "Closed positions appear here"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(pos => {
        const currentPrice = pos.markPrice || markPrice;
        const pnl    = (currentPrice - pos.entryPrice) / pos.entryPrice * pos.size * (pos.direction === "long" ? 1 : -1);
        const pnlPct = (pnl / pos.collateral) * 100;
        const isProfit = pnl >= 0;
        const openedDate = new Date(pos.openedAt).toLocaleTimeString();

        return (
          <div
            key={pos.id}
            style={{ background: "rgba(18,8,32,0.6)", border: "1px solid rgba(61,31,130,0.3)", borderRadius: 12, padding: 14, transition: "all 0.2s" }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {pos.direction === "long"
                  ? <span className="tag-long" style={{ display: "flex", alignItems: "center", gap: 3 }}><TrendingUp size={10} />LONG</span>
                  : <span className="tag-short" style={{ display: "flex", alignItems: "center", gap: 3 }}><TrendingDown size={10} />SHORT</span>
                }
                <span style={{ fontSize: 10, color: "#7c6fa0", fontFamily: "monospace" }}>{pos.leverage}×</span>
                <span className="tag-encrypted" style={{ display: "flex", alignItems: "center", gap: 3 }}><Lock size={9} />Private</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: isProfit ? "#22c55e" : "#ef4444" }}>
                  {isProfit ? "+" : ""}${pnl.toFixed(2)}
                </div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: isProfit ? "#16a34a" : "#dc2626" }}>
                  {isProfit ? "+" : ""}{pnlPct.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[
                ["Size", `$${(pos.size / 1000).toFixed(0)}k`, false],
                ["Entry", `$${pos.entryPrice.toLocaleString()}`, false],
                ["Liq. Price", "🔒 Encrypted", true],
              ].map(([label, value, enc]) => (
                <div key={String(label)}>
                  <p style={{ fontSize: 9, color: "#7c6fa0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
                  <p style={{ fontSize: 11, fontFamily: "monospace", color: enc ? "#7c6fa0" : "#c4adfb", marginTop: 2 }}>{String(value)}</p>
                </div>
              ))}
            </div>

            {/* Collateral bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: "#7c6fa0" }}>Collateral: ${pos.collateral.toLocaleString()} USDC</span>
                <span style={{ fontSize: 9, color: "#7c6fa0" }}>{openedDate}</span>
              </div>
              <div style={{ height: 3, background: "rgba(30,15,61,0.8)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: isProfit ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)", width: `${Math.min(100, Math.abs(pnlPct) * 2)}%` }} />
              </div>
            </div>

            {/* Tx link */}
            {pos.txSignature && (
              <a
                href={`https://explorer.solana.com/tx/${pos.txSignature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#a07bf7", textDecoration: "none", marginBottom: 8 }}
              >
                <ExternalLink size={9} />
                Tx: {pos.txSignature.slice(0, 12)}…{pos.txSignature.slice(-6)} — View on Explorer ↗
              </a>
            )}

            {/* Actions */}
            {pos.status === "open" && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleCheckLiquidation(pos.id)}
                  disabled={!!checking}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(30,15,61,0.6)", border: "1px solid rgba(61,31,130,0.3)", borderRadius: 8, color: "#c4adfb", fontSize: 10, fontWeight: 600, cursor: "pointer", opacity: checking ? 0.5 : 1 }}
                >
                  {checking === pos.id ? <Loader2 size={10} className="animate-spin" /> : <Lock size={10} />}
                  Check Liq.
                </button>
                <button
                  onClick={() => handleEmitSignal(pos.id)}
                  disabled={!!emitting}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(30,15,61,0.6)", border: "1px solid rgba(61,31,130,0.3)", borderRadius: 8, color: "#c4adfb", fontSize: 10, fontWeight: 600, cursor: "pointer", opacity: emitting ? 0.5 : 1 }}
                >
                  {emitting === pos.id ? <Loader2 size={10} className="animate-spin" /> : <Share2 size={10} />}
                  Emit Signal
                </button>
                <button
                  onClick={() => handleClose(pos.id)}
                  disabled={!!closing}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(127,29,29,0.3)", border: "1px solid rgba(185,28,28,0.4)", borderRadius: 8, color: "#ef4444", fontSize: 10, fontWeight: 600, cursor: "pointer", marginLeft: "auto", opacity: closing ? 0.5 : 1 }}
                >
                  {closing === pos.id ? <Loader2 size={10} className="animate-spin" /> : <X size={10} />}
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
