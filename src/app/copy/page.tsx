"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Users, TrendingUp, TrendingDown, Lock, Share2, Eye, Loader2, Star } from "lucide-react";

// Mock signal data (in production, fetched from on-chain CopySignalEvents)
const SIGNALS = [
  {
    trader:        "7xKr...m9Pq",
    fullAddress:   "7xKrm9PqABCdefGH123456789",
    direction:     "long" as const,
    emittedAt:     "3 mins ago",
    followers:     142,
    winRate:       68,
    rank:          1,
    verified:      true,
  },
  {
    trader:        "3nFw...4Rtz",
    fullAddress:   "3nFw4RtzXYZabcde987654321",
    direction:     "short" as const,
    emittedAt:     "11 mins ago",
    followers:     89,
    winRate:       61,
    rank:          2,
    verified:      false,
  },
  {
    trader:        "Bq8L...jKm2",
    fullAddress:   "Bq8LjKm2MNOPQRST112233445",
    direction:     "long" as const,
    emittedAt:     "28 mins ago",
    followers:     54,
    winRate:       55,
    rank:          3,
    verified:      false,
  },
  {
    trader:        "H2dP...sVx7",
    fullAddress:   "H2dPsVx7UVWXYZ9988776655",
    direction:     "short" as const,
    emittedAt:     "1 hour ago",
    followers:     31,
    winRate:       72,
    rank:          4,
    verified:      true,
  },
  {
    trader:        "5mQc...eW1n",
    fullAddress:   "5mQceW1nABCDEFGH445566778",
    direction:     "long" as const,
    emittedAt:     "2 hours ago",
    followers:     18,
    winRate:       58,
    rank:          5,
    verified:      false,
  },
];

export default function CopyPage() {
  const { connected } = useWallet();
  const [following,    setFollowing]    = useState<Set<string>>(new Set());
  const [copyLoading,  setCopyLoading]  = useState<string | null>(null);

  const handleFollow = async (address: string, direction: "long" | "short") => {
    if (!connected) {
      toast.error("Connect wallet to follow traders");
      return;
    }
    setCopyLoading(address);
    const t = toast.loading("Subscribing to signal feed…");
    await new Promise(r => setTimeout(r, 2000));
    toast.success(
      `Now following ${address.slice(0, 6)}… — You'll see their ${direction.toUpperCase()} signals`,
      { id: t, duration: 5000 }
    );
    setFollowing(prev => new Set([...prev, address]));
    setCopyLoading(null);
  };

  const handleUnfollow = (address: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.delete(address);
      return next;
    });
    toast("Unfollowed trader", { icon: "👋" });
  };

  return (
    <div className="min-h-screen bg-arcium-950">
      <Navbar />
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-purple pointer-events-none" />

      <div className="relative pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-arcium-700/50 rounded-xl flex items-center justify-center border border-arcium-600/30">
                <Users className="w-5 h-5 text-arcium-300" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-arcium-100">Copy Trading</h1>
                <p className="text-xs text-arcium-500">Encrypted intent signals · Direction only · Powered by Arcium MPC</p>
              </div>
            </div>

            {/* Privacy callout */}
            <div className="glass-card p-4 flex items-start gap-3">
              <Lock className="w-4 h-4 text-arcium-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-display font-medium text-arcium-200 mb-1">
                  Privacy-preserving copy trading
                </p>
                <p className="text-xs text-arcium-400 leading-relaxed">
                  You see only the <strong className="text-arcium-300">direction</strong> (LONG or SHORT) of each signal.
                  Position size, entry price, leverage, and liquidation threshold are computed by Arcium's MPC
                  and never revealed — even to followers. Traders opt-in to share signals voluntarily.
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              ["Active Signals",   SIGNALS.length,       ""],
              ["Total Followers",  SIGNALS.reduce((a, s) => a + s.followers, 0), ""],
              ["Your Following",   following.size,        ""],
            ].map(([label, value]) => (
              <div key={String(label)} className="glass-card p-4 text-center">
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Signals table ── */}
          <div className="glass-card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-arcium-700/40 text-[10px] font-display font-semibold text-arcium-500 uppercase tracking-widest">
              <span>#</span>
              <span>Trader</span>
              <span className="text-center">Signal</span>
              <span className="text-center hidden sm:block">Win Rate</span>
              <span className="text-center hidden sm:block">Followers</span>
              <span className="text-right">Action</span>
            </div>

            {/* Rows */}
            {SIGNALS.map((sig) => {
              const isFollowing = following.has(sig.fullAddress);
              const loading     = copyLoading === sig.fullAddress;

              return (
                <div
                  key={sig.fullAddress}
                  className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-b border-arcium-800/40 items-center hover:bg-arcium-800/20 transition-colors ${
                    isFollowing ? "bg-arcium-800/20" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-6 text-center">
                    {sig.rank <= 3 ? (
                      <Star className={`w-4 h-4 mx-auto ${
                        sig.rank === 1 ? "text-yellow-400" :
                        sig.rank === 2 ? "text-arcium-300" :
                        "text-amber-700"
                      }`} />
                    ) : (
                      <span className="text-xs text-arcium-600 font-mono">{sig.rank}</span>
                    )}
                  </div>

                  {/* Trader */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-arcium-700/60 border border-arcium-600/30 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-arcium-300">{sig.trader.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-arcium-200">{sig.trader}</p>
                        <p className="text-[10px] text-arcium-600">{sig.emittedAt}</p>
                      </div>
                      {sig.verified && (
                        <span className="hidden sm:block px-1.5 py-0.5 bg-arcium-700/40 text-arcium-400 text-[9px] font-mono rounded border border-arcium-600/30">
                          verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="flex justify-center">
                    {sig.direction === "long" ? (
                      <span className="tag-long flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />LONG
                      </span>
                    ) : (
                      <span className="tag-short flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />SHORT
                      </span>
                    )}
                  </div>

                  {/* Win rate */}
                  <div className="hidden sm:flex justify-center">
                    <span className={`text-xs font-mono ${sig.winRate >= 65 ? "text-green-400" : sig.winRate >= 55 ? "text-arcium-300" : "text-red-400"}`}>
                      {sig.winRate}%
                    </span>
                  </div>

                  {/* Followers */}
                  <div className="hidden sm:flex justify-center">
                    <span className="text-xs font-mono text-arcium-400">{sig.followers}</span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        isFollowing
                          ? handleUnfollow(sig.fullAddress)
                          : handleFollow(sig.fullAddress, sig.direction)
                      }
                      disabled={loading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all disabled:opacity-50 ${
                        isFollowing
                          ? "bg-arcium-700/40 text-arcium-300 border border-arcium-600/30 hover:border-red-700/40 hover:text-red-400"
                          : "bg-arcium-600/40 hover:bg-arcium-500/50 text-arcium-200 border border-arcium-500/40 hover:border-arcium-400/60"
                      }`}
                    >
                      {loading
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : isFollowing
                          ? <Eye className="w-3 h-3" />
                          : <Share2 className="w-3 h-3" />
                      }
                      {loading ? "…" : isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Privacy reminder ── */}
          <div className="mt-6 text-center">
            <p className="text-xs text-arcium-600 font-mono">
              All signals derived from Mxe-encrypted positions via Arcium MPC ·{" "}
              <span className="text-arcium-500">Only direction is revealed — never size, price, or leverage</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
