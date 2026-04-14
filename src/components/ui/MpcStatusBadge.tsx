"use client";
import { useState, useEffect } from "react";
import { Shield, Wifi } from "lucide-react";

export function MpcStatusBadge() {
  const [ping, setPing] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(35 + Math.random() * 30));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-arcium-900/60 border border-arcium-700/30 rounded-xl">
      <div className="flex items-center gap-1.5">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 bg-neon-green rounded-full animate-ping opacity-75" />
          <div className="w-2 h-2 bg-neon-green rounded-full" />
        </div>
        <Shield className="w-3.5 h-3.5 text-arcium-400" />
      </div>
      <div className="hidden sm:block">
        <p className="text-[10px] font-mono text-arcium-400 leading-none">Arcium MPC</p>
        <p className="text-[10px] font-mono text-arcium-600 leading-none mt-0.5">{ping}ms</p>
      </div>
    </div>
  );
}
