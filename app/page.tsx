"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchResult } from "@/app/lib/types";
import SearchBar from "@/app/components/SearchBar";

export default function Home() {
  const router = useRouter();

  const handleSelect = (player: SearchResult) => {
    router.push(`/player/${player.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-6 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8 text-accent shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 2C12 2 12 22 12 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M2 12C2 12 22 12 22 12" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M4.93 4.93C8 8 12 10 12 12C12 14 8 16 4.93 19.07" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M19.07 4.93C16 8 12 10 12 12C12 14 16 16 19.07 19.07" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Hoop<span className="text-accent">Scout</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mt-16">
            Find Similar Players
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-lg mx-auto">
            Search any D1 college basketball player to find active players with a
            similar statistical profile
          </p>

          {/* Tab Toggle */}
          <div className="inline-flex bg-muted rounded-lg p-1 mt-8">
            <span className="px-5 py-2.5 rounded-md text-sm font-medium bg-card text-foreground shadow-sm">
              Search by Player
            </span>
            <Link
              href="/build"
              className="px-5 py-2.5 rounded-md text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
            >
              Build a Profile
            </Link>
          </div>
        </div>

        <div className="text-center">
          <div className="max-w-2xl mx-auto mt-8">
            <SearchBar onSelect={handleSelect} />
          </div>

          {/* Stat cards */}
          <div className="flex justify-center gap-8 mt-16 flex-wrap">
            <div className="bg-card rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="text-3xl font-bold text-foreground">90,000+</div>
              <div className="text-sm text-muted-foreground mt-1">Player Seasons</div>
            </div>
            <div className="bg-card rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="text-3xl font-bold text-foreground">19</div>
              <div className="text-sm text-muted-foreground mt-1">Years of Data</div>
            </div>
            <div className="bg-card rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="text-3xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground mt-1">Matching Dimensions</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-16">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </p>
      </main>
    </div>
  );
}
