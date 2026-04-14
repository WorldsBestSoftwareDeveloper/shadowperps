"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Navbar } from "@/components/layout/Navbar";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { PositionsList } from "@/components/trading/PositionsList";
import { MarketTicker } from "@/components/trading/MarketTicker";
import { MpcStatusBadge } from "@/components/ui/MpcStatusBadge";
import { Shield, TrendingUp, TrendingDown, Activity, Lock } from "lucide-react";

export default function TradePage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<"positions" | "history">("positions");

  // Mock live stats (in production these come from program accounts)
  const [stats] = useState({
    markPrice:    52_341.50,
    change24h:    +3.21,
    openInterest: 1_204_320,
    funding:      0.0012,
    volume24h:    8_432_100,
  });

  return (
    <div className="min-h-screen bg-arcium-950">
      <Navbar />
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-purple pointer-events-none" />

      <div className="relative pt-20">
        {/* ── Market ticker bar ── */}
        <MarketTicker stats={stats} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Page header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-arcium-100 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-arcium-700/50 rounded-lg flex items-center justify-center border border-arcium-600/30">
                  <Activity className="w-4 h-4 text-arcium-300" />
                </div>
                BTC-PERP
                <span className="text-sm font-normal text-arcium-500 ml-1">/ USDC</span>
              </h1>
              <p className="text-xs text-arcium-500 mt-1 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                All positions encrypted via Arcium MPC · Solana Devnet
              </p>
            </div>
            <MpcStatusBadge />
          </div>

          {/* ── Main grid ── */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-5">

            {/* ── Left: Chart area + positions ── */}
            <div className="space-y-5">
              {/* Mock chart placeholder */}
              <MockChart price={stats.markPrice} change={stats.change24h} />

              {/* Positions / history tabs */}
              <div className="glass-card overflow-hidden">
                <div className="flex border-b border-arcium-700/40">
                  {(["positions", "history"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-display font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? "text-arcium-200 border-b-2 border-arcium-400 bg-arcium-800/30"
                          : "text-arcium-500 hover:text-arcium-300"
                      }`}
                    >
                      {tab === "positions" ? "Open Positions" : "Trade History"}
                    </button>
                  ))}
                </div>
                <div className="p-4">
                  {connected ? (
                    <PositionsList walletAddress={publicKey?.toBase58()} activeTab={activeTab} />
                  ) : (
                    <div className="text-center py-10 text-arcium-500">
                      <Lock className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Connect wallet to view positions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: Trading panel ── */}
            <div>
              {connected ? (
                <TradingPanel markPrice={stats.markPrice} />
              ) : (
                <div className="glass-card p-8 text-center">
                  <div className="w-14 h-14 bg-arcium-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-arcium-700/30">
                    <Shield className="w-7 h-7 text-arcium-400" />
                  </div>
                  <h3 className="font-display font-semibold text-arcium-100 mb-2">Connect to Trade</h3>
                  <p className="text-sm text-arcium-400 mb-6">
                    Connect your Solana wallet to open encrypted perpetual positions.
                  </p>
                  <WalletMultiButton />
                  <p className="text-xs text-arcium-600 mt-4">Solana Devnet only · No real funds</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mock price chart (replace with real chart in production) ──────────────

function MockChart({ price, change }: { price: number; change: number }) {
  const isUp = change >= 0;

  // Generate a fake sparkline
  const points = Array.from({ length: 60 }, (_, i) => {
    const noise = (Math.sin(i * 0.3) + Math.sin(i * 0.7) * 0.5) * 800;
    return price - 1200 + noise + (i / 60) * 1200;
  });
  const min = Math.min(...points);
  const max = Math.max(...points);
  const normalize = (v: number) => ((v - min) / (max - min)) * 100;
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 59) * 100} ${100 - normalize(p)}`).join(" ");

  return (
    <div className="glass-card p-5 h-[240px] relative overflow-hidden">
      {/* Price header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-2xl font-display font-bold text-arcium-100">
            ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center gap-1 text-sm font-mono ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isUp ? "+" : ""}{change}%
            <span className="text-arcium-600 ml-1">24h</span>
          </div>
        </div>
        <div className="flex gap-2">
          {["1H", "4H", "1D", "1W"].map(tf => (
            <button key={tf} className={`text-xs font-mono px-2 py-1 rounded-lg transition-colors ${
              tf === "1D" ? "bg-arcium-700/60 text-arcium-200 border border-arcium-600/40" : "text-arcium-600 hover:text-arcium-400"
            }`}>{tf}</button>
          ))}
        </div>
      </div>

      {/* SVG sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#chartGrad)" />
          <path d={pathD} fill="none" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
