"use client";
import Link from "next/link";
import { Shield, Lock, Zap, Users, ArrowRight, Eye, EyeOff, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: Lock,
    title: "Private Positions",
    description: "Entry price, size, and leverage encrypted inside Arcium's MPC cluster. Only you see your position.",
    color: "arcium",
  },
  {
    icon: Shield,
    title: "Fair Liquidations",
    description: "Liquidation checks run on encrypted data. Only a yes/no boolean is revealed — no front-running.",
    color: "blue",
  },
  {
    icon: Users,
    title: "Safe Copy-Trading",
    description: "Follow top traders' directional signals (long/short) without ever seeing their position size or entry.",
    color: "green",
  },
  {
    icon: Zap,
    title: "Zero MEV",
    description: "Orders are invisible to searchers. No sandwich attacks. No toxic order flow.",
    color: "neon",
  },
];

const STEPS = [
  { step: "01", title: "Connect Wallet",       desc: "Link your Phantom or Solflare wallet on Solana Devnet." },
  { step: "02", title: "Deposit Collateral",   desc: "Deposit devnet USDC. Funds are locked in the on-chain vault." },
  { step: "03", title: "Open Private Position", desc: "Choose direction + leverage. Trade inputs encrypted before leaving your browser." },
  { step: "04", title: "MPC Computes Privately", desc: "Arcium's network calculates your liquidation price without seeing plaintext." },
  { step: "05", title: "Copy or Broadcast",    desc: "Emit a directional signal for copy-traders, or follow others privately." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-arcium-950 overflow-hidden">
      <Navbar />

      {/* ── Background effects ── */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-purple pointer-events-none" />
      <div className="fixed inset-0 bg-radial-blue pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-arcium-800/60 border border-arcium-600/40 rounded-full mb-8 animate-fade-up">
          <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          <span className="text-sm font-mono text-arcium-300">Powered by Arcium MPC · Solana Devnet</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-arcium-50 mb-6 leading-tight tracking-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Trade Perps.
          <br />
          <span className="bg-gradient-to-r from-arcium-400 via-neon-purple to-arcium-300 bg-clip-text text-transparent">
            Stay Private.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-arcium-300 mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Your positions and liquidation logic are computed privately using Arcium.
          Only final PnL is revealed — preventing copy trading exploitation and MEV attacks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/guide" className="btn-primary flex items-center gap-2 text-base">
            <BookOpen className="w-5 h-5" />
            Read the Guide
          </Link>
          <Link href="/trade" className="btn-secondary flex items-center gap-2 text-base">
            Start Trading
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Privacy comparison */}
        <div className="mt-16 max-w-2xl mx-auto grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="glass-card p-5 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-red-400" />
              <span className="text-sm font-display font-semibold text-red-300">Traditional Perps</span>
            </div>
            <ul className="space-y-1.5 text-xs text-arcium-400">
              {["Entry price visible", "Size exposed on-chain", "Liq threshold public", "Front-runnable"].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-5 text-left border-arcium-500/40" style={{ boxShadow: "0 0 20px rgba(91,47,212,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <EyeOff className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-display font-semibold text-neon-green">PrivatePerps</span>
            </div>
            <ul className="space-y-1.5 text-xs text-arcium-300">
              {["Price → MPC encrypted", "Size → MPC encrypted", "Liq → bool only", "MEV-resistant"].map(t => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neon-green" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-arcium-100 text-center mb-12">
            Built different.
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass-card-hover p-6">
                <div className="w-10 h-10 bg-arcium-700/50 rounded-xl flex items-center justify-center mb-4 border border-arcium-600/30">
                  <Icon className="w-5 h-5 text-arcium-300" />
                </div>
                <h3 className="font-display font-semibold text-arcium-100 mb-2">{title}</h3>
                <p className="text-sm text-arcium-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-arcium-100 text-center mb-4">
            How it works
          </h2>
          <p className="text-arcium-400 text-center mb-12">Five steps. Fully private. On-chain verifiable.</p>
          <div className="space-y-3">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="glass-card p-5 flex items-start gap-5">
                <div className="shrink-0 w-10 h-10 bg-arcium-700/60 border border-arcium-600/40 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-arcium-300">{step}</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-arcium-100 mb-0.5">{title}</h4>
                  <p className="text-sm text-arcium-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative px-6 pb-24 text-center">
        <div className="max-w-xl mx-auto glass-card p-10" style={{ boxShadow: "0 0 60px rgba(91,47,212,0.2)" }}>
          <TrendingUp className="w-10 h-10 text-arcium-400 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-arcium-100 mb-3">Ready to trade?</h2>
          <p className="text-arcium-400 mb-8 text-sm">Start on Solana Devnet. No real money at risk.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/guide" className="btn-secondary">Read Guide</Link>
            <Link href="/trade" className="btn-primary flex items-center gap-2">
              Open Position <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-arcium-800/50 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-arcium-400">Private<span className="text-arcium-600">Perps</span></span>
          <span className="text-xs text-arcium-600 font-mono">Solana Devnet · Arcium MPC · Not for production use</span>
          <div className="flex gap-4">
            <a href="https://docs.arcium.com" target="_blank" rel="noreferrer" className="text-xs text-arcium-500 hover:text-arcium-300 transition-colors">Arcium Docs</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs text-arcium-500 hover:text-arcium-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Missing import fix
function BookOpen(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
