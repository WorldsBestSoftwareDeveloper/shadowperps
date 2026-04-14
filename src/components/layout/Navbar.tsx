"use client";
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Shield, Activity, BookOpen, Users } from "lucide-react";

const NAV_LINKS = [
  { href: "/guide",  label: "Guide",    icon: BookOpen },
  { href: "/trade",  label: "Trade",    icon: Activity },
  { href: "/copy",   label: "Copy",     icon: Users },
];

export const Navbar: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-arcium-950/80 backdrop-blur-xl border-b border-arcium-800/50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-arcium-500 rounded-lg opacity-30 group-hover:opacity-50 transition-opacity animate-pulse-slow" />
          <Shield className="w-5 h-5 text-arcium-300 relative z-10" />
        </div>
        <span className="font-display font-bold text-lg text-arcium-100 tracking-tight">
          Private<span className="text-arcium-400">Perps</span>
        </span>
        <span className="px-1.5 py-0.5 bg-arcium-800/80 text-arcium-400 text-[10px] font-mono rounded border border-arcium-700/40 ml-1">
          DEVNET
        </span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-medium transition-all duration-200 ${
                active
                  ? "bg-arcium-700/50 text-arcium-200 border border-arcium-600/40"
                  : "text-arcium-400 hover:text-arcium-200 hover:bg-arcium-800/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Wallet */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-arcium-900/60 rounded-lg border border-arcium-700/30">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-mono text-arcium-400">Arcium MPC</span>
        </div>
        <WalletMultiButton />
      </div>
    </nav>
  );
};
