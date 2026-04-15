"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { Lock, TrendingUp, TrendingDown, Loader2, ChevronDown, ExternalLink } from "lucide-react";
import { useOnChainTrade } from "@/hooks/useOnChainTrade";

interface Props {
  markPrice: number;
}

const LEVERAGE_PRESETS = [1, 2, 5, 10, 20, 50, 100];

export function TradingPanel({ markPrice }: Props) {
  const { publicKey } = useWallet();
  const { openPosition, loading } = useOnChainTrade();

  const [direction,  setDirection]  = useState<"long" | "short">("long");
  const [collateral, setCollateral] = useState("");
  const [leverage,   setLeverage]   = useState(5);
  const [showInfo,   setShowInfo]   = useState(false);
  const [lastTx,     setLastTx]     = useState<string | null>(null);

  const collateralNum = parseFloat(collateral) || 0;
  const positionSize  = collateralNum * leverage;
  const liqPrice      = direction === "long"
    ? markPrice * (1 - 1 / leverage)
    : markPrice * (1 + 1 / leverage);
  const liqDistance   = Math.abs(((liqPrice - markPrice) / markPrice) * 100);

  const handleOpenPosition = async () => {
    if (!publicKey) { toast.error("Connect your wallet first"); return; }
    if (collateralNum <= 0) { toast.error("Enter a collateral amount"); return; }

    const toastId = toast.loading("Encrypting trade inputs via Arcium…");

    try {
      await new Promise(r => setTimeout(r, 800));
      toast.loading("Please sign the transaction in your wallet…", { id: toastId });

      const result = await openPosition({
        direction,
        collateral: collateralNum,
        leverage,
        markPrice,
      });

      setLastTx(result.signature);
      setCollateral("");

      toast.success(
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {direction.toUpperCase()} position opened! 🎉
          </div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>
            Signed on Solana Devnet
          </div>
          <a
            href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 11, color: "#a07bf7", textDecoration: "underline", display: "block", marginTop: 4 }}
          >
            View on Explorer ↗
          </a>
        </div>,
        { id: toastId, duration: 8000 }
      );
    } catch (e: any) {
      const msg = e?.message?.includes("rejected") ? "Transaction rejected by user" : (e?.message || "Failed");
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <div className="glass-card overflow-hidden sticky top-24">
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(61,31,130,0.4)" }}>
        <button
          onClick={() => setDirection("long")}
          style={{
            flex: 1, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: direction === "long" ? "rgba(34,197,94,0.12)" : "transparent",
            color: direction === "long" ? "#22c55e" : "#7c6fa0",
            borderBottom: direction === "long" ? "2px solid #22c55e" : "2px solid transparent",
            border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
            transition: "all 0.2s",
          }}
        >
          <TrendingUp size={15} /> Long
        </button>
        <button
          onClick={() => setDirection("short")}
          style={{
            flex: 1, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: direction === "short" ? "rgba(239,68,68,0.12)" : "transparent",
            color: direction === "short" ? "#ef4444" : "#7c6fa0",
            borderBottom: direction === "short" ? "2px solid #ef4444" : "2px solid transparent",
            border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
            transition: "all 0.2s",
          }}
        >
          <TrendingDown size={15} /> Short
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {/* Privacy notice */}
        <div
          onClick={() => setShowInfo(!showInfo)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: "rgba(61,31,130,0.12)", border: "1px solid rgba(91,47,212,0.2)",
            borderRadius: 10, padding: "9px 11px", marginBottom: 14, cursor: "pointer",
          }}
        >
          <Lock size={13} style={{ color: "#a07bf7", marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 10, color: "#7c6fa0", lineHeight: 1.5, flex: 1 }}>
            Trade inputs encrypted by Arcium MPC before leaving your browser
          </p>
          <ChevronDown size={13} style={{ color: "#7c6fa0", transform: showInfo ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
        </div>
        {showInfo && (
          <p style={{ fontSize: 10, color: "#7c6fa0", lineHeight: 1.6, marginBottom: 12, background: "rgba(18,8,32,0.6)", borderRadius: 8, padding: "8px 10px" }}>
            Your entry price, size, leverage, and liquidation threshold are encrypted with x25519 ECDH.
            Arcium MPC computes your liquidation price without ever seeing plaintext values.
          </p>
        )}

        {/* Mark price */}
        <div style={{ marginBottom: 12 }}>
          <label className="label">Mark Price</label>
          <div className="input-field" style={{ display: "flex", justifyContent: "space-between", opacity: 0.7, cursor: "not-allowed" }}>
            <span style={{ fontFamily: "monospace" }}>${markPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span style={{ fontSize: 10, color: "#7c6fa0" }}>Oracle</span>
          </div>
        </div>

        {/* Collateral */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label className="label">Collateral (USDC)</label>
            <span style={{ fontSize: 10, color: "#7c6fa0", fontFamily: "monospace" }}>Bal: 10,000.00</span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              placeholder="0.00"
              value={collateral}
              onChange={e => setCollateral(e.target.value)}
              className="input-field"
              style={{ paddingRight: 48, fontFamily: "monospace" }}
            />
            <button
              onClick={() => setCollateral("10000")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "#7c4ff0", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
            >
              MAX
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {[100, 500, 1000, 5000].map(a => (
              <button
                key={a}
                onClick={() => setCollateral(String(a))}
                style={{ flex: 1, padding: "4px 0", fontSize: 10, fontFamily: "monospace", background: "rgba(30,15,61,0.6)", border: "1px solid rgba(61,31,130,0.3)", borderRadius: 8, color: "#7c6fa0", cursor: "pointer" }}
              >
                {a >= 1000 ? `${a/1000}k` : a}
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label className="label">Leverage</label>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#c4adfb" }}>{leverage}×</span>
          </div>
          <input
            type="range" min="1" max="100" value={leverage}
            onChange={e => setLeverage(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#5b2fd4", cursor: "pointer" }}
          />
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            {LEVERAGE_PRESETS.map(l => (
              <button
                key={l}
                onClick={() => setLeverage(l)}
                style={{
                  padding: "3px 8px", fontSize: 10, fontFamily: "monospace", borderRadius: 8, cursor: "pointer",
                  background: leverage === l ? "rgba(61,31,130,0.5)" : "rgba(30,15,61,0.4)",
                  border: `1px solid ${leverage === l ? "rgba(91,47,212,0.6)" : "rgba(61,31,130,0.3)"}`,
                  color: leverage === l ? "#c4adfb" : "#7c6fa0",
                }}
              >
                {l}×
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        {collateralNum > 0 && (
          <div style={{ borderTop: "1px solid rgba(61,31,130,0.2)", borderBottom: "1px solid rgba(61,31,130,0.2)", padding: "10px 0", marginBottom: 14 }}>
            {[
              ["Position Size", `$${positionSize.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, false],
              ["Entry Price", `$${markPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, false],
              ["Liq. Price", "🔒 Computed privately by MPC", true],
              ["Liq. Distance", `~${liqDistance.toFixed(1)}% from entry`, false],
            ].map(([k, v, enc]) => (
              <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                <span style={{ fontSize: 11, color: "#7c6fa0" }}>{k}</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: enc ? "#7c6fa0" : "#c4adfb", display: "flex", alignItems: "center", gap: 3 }}>
                  {enc && <Lock size={9} />}{String(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Last tx link */}
        {lastTx && (
          <a
            href={`https://explorer.solana.com/tx/${lastTx}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#a07bf7", marginBottom: 10, textDecoration: "none" }}
          >
            <ExternalLink size={10} />
            Last tx: {lastTx.slice(0, 12)}…{lastTx.slice(-6)} ↗
          </a>
        )}

        {/* Submit button */}
        <button
          onClick={handleOpenPosition}
          disabled={loading || !collateral || !publicKey}
          style={{
            width: "100%", padding: "13px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            cursor: loading || !collateral || !publicKey ? "not-allowed" : "pointer",
            opacity: loading || !collateral || !publicKey ? 0.5 : 1,
            border: "none", transition: "all 0.2s",
            background: direction === "long" ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#7f1d1d,#b91c1c)",
            color: "white",
          }}
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> Signing via Wallet…</>
          ) : (
            <>{direction === "long" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              Open {leverage}× {direction.charAt(0).toUpperCase() + direction.slice(1)}</>
          )}
        </button>

        <p style={{ textAlign: "center", fontSize: 10, color: "#3d1f82", fontFamily: "monospace", marginTop: 8 }}>
          Devnet only · Arcium MPC · No real funds
        </p>
      </div>
    </div>
  );
}
