"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  Shield, Lock, Zap, Users, ChevronDown, ChevronRight,
  Wallet, ArrowRight, AlertTriangle, CheckCircle,
  Code, Layers, RefreshCw, Eye, EyeOff, Key
} from "lucide-react";

// ── Accordion component ──────────────────────────────────────────────────

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-arcium-700/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-arcium-900/60 hover:bg-arcium-800/60 transition-colors"
      >
        <span className="font-display font-medium text-arcium-100 text-left">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-arcium-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-arcium-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-arcium-950/60 text-sm text-arcium-300 leading-relaxed border-t border-arcium-700/30">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Step card ─────────────────────────────────────────────────────────────

function StepCard({ n, title, desc, detail }: { n: string; title: string; desc: string; detail?: string }) {
  return (
    <div className="glass-card p-6 flex gap-4">
      <div className="shrink-0 w-11 h-11 bg-arcium-700/60 border border-arcium-500/30 rounded-xl flex items-center justify-center">
        <span className="text-sm font-mono font-bold text-arcium-300">{n}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-display font-semibold text-arcium-100 mb-1">{title}</h3>
        <p className="text-arcium-400 text-sm mb-2">{desc}</p>
        {detail && (
          <p className="text-xs text-arcium-500 bg-arcium-900/60 rounded-lg px-3 py-2 border border-arcium-700/30 font-mono">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Privacy diagram ───────────────────────────────────────────────────────

function PrivacyFlow() {
  const steps = [
    { label: "Your Browser", sublabel: "Encrypts inputs with x25519", icon: Key, color: "text-arcium-300" },
    { label: "Solana Program", sublabel: "Queues computation on-chain", icon: Layers, color: "text-arcium-400" },
    { label: "Arcium MPC", sublabel: "Computes on encrypted data", icon: Shield, color: "text-neon-purple" },
    { label: "Callback", sublabel: "Only result revealed", icon: CheckCircle, color: "text-neon-green" },
  ];
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
      {steps.map(({ label, sublabel, icon: Icon, color }, i) => (
        <div key={label} className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 flex-1">
          <div className={`relative flex-1 sm:w-full flex flex-col items-center ${i !== steps.length - 1 ? "sm:after:content-['→'] sm:after:absolute sm:after:-right-3 sm:after:top-3 sm:after:text-arcium-600" : ""}`}>
            <div className="w-10 h-10 bg-arcium-800/80 border border-arcium-600/40 rounded-xl flex items-center justify-center mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className="text-xs font-display font-semibold text-arcium-200 text-center">{label}</span>
            <span className="text-[10px] text-arcium-500 text-center mt-0.5">{sublabel}</span>
          </div>
          {i !== steps.length - 1 && (
            <ChevronRight className="sm:hidden w-4 h-4 text-arcium-600 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-arcium-950">
      <Navbar />
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-purple pointer-events-none" />

      <div className="relative pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-arcium-800/60 border border-arcium-600/40 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5 text-arcium-400" />
              <span className="text-xs font-mono text-arcium-400">User Guide · Devnet</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-arcium-50 mb-4 tracking-tight">
              How to use<br />
              <span className="bg-gradient-to-r from-arcium-400 to-neon-purple bg-clip-text text-transparent">
                PrivatePerps
              </span>
            </h1>
            <p className="text-arcium-300 text-lg max-w-xl mx-auto leading-relaxed">
              A step-by-step guide to trading encrypted perpetual futures on Solana Devnet,
              powered by Arcium's multi-party computation.
            </p>
          </div>

          {/* ── Devnet banner ── */}
          <div className="flex items-start gap-3 p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl mb-10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-display font-semibold text-amber-300 mb-1">Devnet Only</p>
              <p className="text-xs text-amber-500 leading-relaxed">
                PrivatePerps runs exclusively on <strong className="text-amber-400">Solana Devnet</strong>.
                No real money is involved. All tokens (SOL and USDC) are test tokens with zero monetary value.
                This is a hackathon submission — not a production protocol.
              </p>
            </div>
          </div>

          {/* ── Privacy flow diagram ── */}
          <div className="glass-card p-6 mb-10">
            <h2 className="font-display font-semibold text-arcium-100 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-arcium-400" />
              How privacy works
            </h2>
            <PrivacyFlow />
            <p className="text-xs text-arcium-500 mt-5 text-center">
              Your trade data is encrypted in the browser before it ever reaches the chain.
              Arcium's MPC cluster computes on ciphertexts — no node sees plaintext values.
            </p>
          </div>

          {/* ── Getting started steps ── */}
          <h2 className="font-display font-bold text-arcium-100 text-xl mb-5">Getting started</h2>
          <div className="space-y-4 mb-12">
            <StepCard
              n="1"
              title="Get a Solana wallet"
              desc="Install Phantom or Solflare browser extension and create a new wallet."
              detail="phantom.app  /  solflare.com  — both free, takes 2 minutes"
            />
            <StepCard
              n="2"
              title="Switch to Devnet"
              desc="In your wallet settings, switch the network to 'Devnet' (not Mainnet)."
              detail="Phantom: Settings → Developer settings → Change network → Devnet"
            />
            <StepCard
              n="3"
              title="Airdrop devnet SOL"
              desc="You need SOL to pay for transactions. Get free devnet SOL from a faucet."
              detail="faucet.solana.com  — click 'Devnet', paste your address, click Airdrop"
            />
            <StepCard
              n="4"
              title="Get devnet USDC"
              desc="PrivatePerps uses USDC as collateral. Mint yourself free devnet USDC using the button in the Trade page."
              detail="We provide a 'Mint Test USDC' button on the Trade page — no external faucet needed."
            />
            <StepCard
              n="5"
              title="Connect your wallet"
              desc="Click 'Select Wallet' in the top-right corner of any page and approve the connection."
            />
            <StepCard
              n="6"
              title="Open a position"
              desc="Go to the Trade page. Enter your position size, leverage (1-100x), and direction. Click 'Open Position'."
              detail="Your inputs are encrypted in the browser before being sent to Solana."
            />
            <StepCard
              n="7"
              title="Wait for MPC"
              desc="Arcium's MPC cluster processes your encrypted trade. This takes ~10-30 seconds on devnet."
              detail="You'll see a 'Computing...' status while Arcium's nodes perform multi-party computation."
            />
            <StepCard
              n="8"
              title="View your position"
              desc="Once confirmed, your position shows as 'Open'. Your encrypted PnL is shown — only you can decrypt it with your shared secret."
            />
          </div>

          {/* ── Feature guide ── */}
          <h2 className="font-display font-bold text-arcium-100 text-xl mb-5">Feature guide</h2>
          <div className="space-y-3 mb-12">
            <Accordion title="🔒 What gets encrypted?">
              <div className="space-y-2">
                <p>The following data is <strong className="text-arcium-200">always encrypted</strong> using Arcium MPC — no node, no operator, no one can see these values:</p>
                <ul className="space-y-1.5 mt-3">
                  {[
                    ["Entry price", "The price at which you opened the position"],
                    ["Position size", "How much you're trading"],
                    ["Leverage", "Your leverage multiplier (1–100×)"],
                    ["Liquidation price", "Computed privately inside MPC, never revealed"],
                    ["Collateral amount", "Your deposited USDC amount"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-arcium-500 mt-1.5 shrink-0" />
                      <span><strong className="text-arcium-200">{k}</strong> — {v}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-arcium-400">The <strong className="text-arcium-300">only public information</strong> is: position open/closed status, collateral amount (needed for token transfers), and a liquidated/not-liquidated boolean.</p>
              </div>
            </Accordion>

            <Accordion title="⚡ How does liquidation work?">
              <div className="space-y-2">
                <p>When you (or anyone) triggers a liquidation check:</p>
                <ol className="space-y-2 list-decimal list-inside mt-2">
                  <li>The current oracle price is encrypted and sent to Arcium.</li>
                  <li>Arcium's MPC compares it with your encrypted liquidation threshold — in private.</li>
                  <li>Only a <strong className="text-arcium-200">boolean result</strong> (liquidated: yes/no) is returned to the chain.</li>
                  <li>Your exact liquidation price is <strong className="text-arcium-200">never revealed</strong> on-chain.</li>
                </ol>
                <p className="mt-2 text-arcium-400">This prevents MEV bots from targeting your position before it reaches the liquidation threshold.</p>
              </div>
            </Accordion>

            <Accordion title="👥 How does copy-trading work?">
              <div className="space-y-2">
                <p>Copy-trading in PrivatePerps is intentionally minimal to preserve privacy:</p>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-arcium-500 mt-1.5 shrink-0" />
                    <span><strong className="text-arcium-200">Traders</strong> can voluntarily emit a <em>directional signal</em> — just a single bit: LONG (1) or SHORT (0).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-arcium-500 mt-1.5 shrink-0" />
                    <span>The signal is derived from the encrypted position by Arcium — only the direction bit escapes MPC.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-arcium-500 mt-1.5 shrink-0" />
                    <span><strong className="text-arcium-200">Followers</strong> see "LONG" or "SHORT" for a given trader wallet — never their size, entry, or leverage.</span>
                  </li>
                </ul>
              </div>
            </Accordion>

            <Accordion title="🔑 What is the shared secret / x25519 key?">
              <div className="space-y-2">
                <p>When you open a position, the frontend:</p>
                <ol className="space-y-1 list-decimal list-inside mt-2">
                  <li>Generates a random <strong className="text-arcium-200">x25519 keypair</strong> in your browser.</li>
                  <li>Fetches the MXE (Arcium cluster) public key from Solana.</li>
                  <li>Computes a <strong className="text-arcium-200">shared secret</strong> via ECDH key exchange.</li>
                  <li>Encrypts your trade inputs with the Rescue cipher using that shared secret.</li>
                </ol>
                <p className="mt-2">This means only your browser AND the Arcium MPC cluster can decrypt the inputs. The shared secret is stored locally (session storage) and is never sent to any server.</p>
              </div>
            </Accordion>

            <Accordion title="📊 What does the oracle price do?">
              <p>In this devnet demo, the oracle price is simulated. An admin can update it manually. In a production version, this would be replaced by a <strong className="text-arcium-200">Pyth Network</strong> CPI (cross-program invocation) for real-time price feeds. The oracle price is used as input to the liquidation check circuit.</p>
            </Accordion>

            <Accordion title="💰 Can I lose money?">
              <p className="text-neon-green font-semibold">No.</p>
              <p className="mt-1">This platform runs on <strong className="text-arcium-200">Solana Devnet</strong>. All SOL and USDC are test tokens with zero real-world value. You cannot connect a mainnet wallet or deposit real funds. There is no mainnet deployment.</p>
            </Accordion>
          </div>

          {/* ── Architecture ── */}
          <div className="glass-card p-6 mb-10">
            <h2 className="font-display font-semibold text-arcium-100 mb-4 flex items-center gap-2">
              <Code className="w-4 h-4 text-arcium-400" />
              Technical architecture
            </h2>
            <div className="space-y-3 text-sm">
              {[
                ["Blockchain", "Solana Devnet — fast, cheap, ideal for devnet testing"],
                ["Smart Contract", "Anchor 0.32.1 — Rust-based Solana program framework"],
                ["MPC Layer", "Arcium MXE — multi-party computation over encrypted data"],
                ["Circuits", "Arcis DSL — 3 custom circuits: open_position, check_liquidation, emit_copy_signal"],
                ["Encryption", "x25519 ECDH key exchange + Rescue cipher (Arcium standard)"],
                ["Frontend", "Next.js 14 + @solana/wallet-adapter + @arcium-hq/client"],
                ["Oracle (demo)", "Simulated mark price — updateable by admin in devnet"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start gap-3">
                  <span className="text-arcium-500 font-mono text-xs w-28 shrink-0 mt-0.5">{k}</span>
                  <span className="text-arcium-300">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="text-center">
            <p className="text-arcium-400 mb-5 text-sm">Ready? Make sure you have devnet SOL first.</p>
            <div className="flex gap-3 justify-center">
              <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2 text-sm">
                <Wallet className="w-4 h-4" />
                Get Devnet SOL
              </a>
              <Link href="/trade" className="btn-primary flex items-center gap-2 text-sm">
                Start Trading
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
