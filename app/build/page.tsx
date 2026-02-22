"use client";

import Link from "next/link";
import ProfileBuilder from "@/app/components/ProfileBuilder";

export default function BuildPage() {
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
            Define minimum thresholds across 7 dimensions to find active D1
            players that match your criteria
          </p>

          {/* Tab Toggle (links) */}
          <div className="inline-flex bg-muted rounded-lg p-1 mt-8">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-md text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
            >
              Search by Player
            </Link>
            <span className="px-5 py-2.5 rounded-md text-sm font-medium bg-card text-foreground shadow-sm">
              Build a Profile
            </span>
          </div>
        </div>

        <div className="mt-8">
          <ProfileBuilder />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-16">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </p>
      </main>
    </div>
  );
}
