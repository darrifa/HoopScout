"use client";

import { useState, useCallback } from "react";
import type {
  SearchResult,
  PlayerDetailResponse,
  MatchesResponse,
} from "@/app/lib/types";
import SearchBar from "@/app/components/SearchBar";
import PlayerCard from "@/app/components/PlayerCard";
import MatchResults from "@/app/components/MatchResults";

export default function Home() {
  const [playerData, setPlayerData] = useState<PlayerDetailResponse | null>(null);
  const [matchData, setMatchData] = useState<MatchesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback(async (player: SearchResult) => {
    setLoading(true);
    setError(null);
    setPlayerData(null);
    setMatchData(null);

    try {
      const [playerRes, matchesRes] = await Promise.all([
        fetch(`/api/player/${player.id}`),
        fetch(`/api/matches/${player.id}`),
      ]);

      if (!playerRes.ok) {
        throw new Error("Failed to load player data");
      }

      const pData: PlayerDetailResponse = await playerRes.json();
      setPlayerData(pData);

      if (matchesRes.ok) {
        const mData: MatchesResponse = await matchesRes.json();
        setMatchData(mData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setPlayerData(null);
    setMatchData(null);
    setError(null);
  };

  const isLanding = !playerData && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-3 flex items-center gap-3">
          <button
            onClick={handleReset}
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
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* ─── Landing page ─── */}
        {isLanding && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mt-16">
              Find Similar Players
            </h2>
            <p className="text-lg text-gray-500 mt-4 max-w-lg mx-auto">
              Search any D1 college basketball player to find active players
              with a similar statistical profile
            </p>

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

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-16">
              Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
            </p>
          </div>
        )}

        {/* ─── Player page ─── */}
        {!isLanding && (
          <div>
            {/* Compact search bar */}
            <SearchBar onSelect={handleSelect} compact />

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-accent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading player data...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mt-6">
                {error}
              </div>
            )}

            {/* Player card */}
            {playerData && !loading && (
              <div className="mt-6">
                <PlayerCard data={playerData} />
              </div>
            )}

            {/* Match results */}
            {matchData && !loading && (
              <div className="mt-10">
                <MatchResults data={matchData} />
              </div>
            )}

            {/* No matches explanation for graduated players */}
            {playerData && !loading && !matchData && playerData.player.is_graduated && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">
                  This player is no longer active. Match comparison shows active
                  2025-26 players only.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer — only on player page, landing has its own inline footer */}
      {!isLanding && (
        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-5xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
            Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
          </div>
        </footer>
      )}
    </div>
  );
}
