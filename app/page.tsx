// app/page.tsx
"use client"

import { useWallet } from '@solana/wallet-adapter-react';
import HomePage from '@/components/HomePage';

export default function Home() {
  const { connecting } = useWallet();

  // derive loading state from connecting instead of local state to avoid synchronous setState in effect
  const isLoading = connecting;

  if (isLoading || connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60 text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-[#14f195] animate-spin" />
          Connecting wallet…
        </div>
      </div>
    );
  }

  return <HomePage />;
}