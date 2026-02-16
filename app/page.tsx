"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SearchResult } from "@/app/lib/types";
import SearchBar from "@/app/components/SearchBar";
import ProfileBuilder from "@/app/components/ProfileBuilder";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"search" | "build">("search");

  const handleSelect = (player: SearchResult) => {
    router.push(`/player/${player.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Hoop<span className="text-accent">Scout</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mt-16">
            Find Similar Players
          </h2>
          <p className="text-lg text-gray-500 mt-4 max-w-lg mx-auto">
            {activeTab === "search"
              ? "Search any D1 college basketball player to find active players with a similar statistical profile"
              : "Define minimum thresholds across 7 dimensions to find active players that match your criteria"}
          </p>

          {/* Tab Toggle */}
          <div className="inline-flex bg-gray-100 rounded-lg p-1 mt-8" role="tablist">
            <button
              onClick={() => setActiveTab("search")}
              role="tab"
              aria-selected={activeTab === "search"}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Search by Player
            </button>
            <button
              onClick={() => setActiveTab("build")}
              role="tab"
              aria-selected={activeTab === "build"}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "build"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Build a Profile
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "search" ? (
          <div className="text-center">
            <div className="max-w-2xl mx-auto mt-8">
              <SearchBar onSelect={handleSelect} />
            </div>

            {/* Stat cards */}
            <div className="flex justify-center gap-8 mt-16 flex-wrap">
              <div className="bg-white rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-3xl font-bold text-gray-900">90,000+</div>
                <div className="text-sm text-gray-500 mt-1">Player Seasons</div>
              </div>
              <div className="bg-white rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-3xl font-bold text-gray-900">19</div>
                <div className="text-sm text-gray-500 mt-1">Years of Data</div>
              </div>
              <div className="bg-white rounded-2xl px-8 py-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-3xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-500 mt-1">Matching Dimensions</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <ProfileBuilder />
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-16">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </p>
      </main>
    </div>
  );
}
