"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  PlayerDetailResponse,
  MatchesResponse,
  SearchResult,
} from "@/app/lib/types";
import SearchBar from "@/app/components/SearchBar";
import PlayerCard from "@/app/components/PlayerCard";
import MatchResults from "@/app/components/MatchResults";

interface Props {
  playerData: PlayerDetailResponse | null;
  matchData: MatchesResponse | null;
}

export default function PlayerPageClient({ playerData, matchData }: Props) {
  const router = useRouter();

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
        {/* Compact search bar */}
        <SearchBar onSelect={handleSelect} compact />

        {/* Error / not found */}
        {!playerData && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mt-6">
            Player not found.
          </div>
        )}

        {/* Player card */}
        {playerData && (
          <div className="mt-6">
            <PlayerCard data={playerData} />
          </div>
        )}

        {/* Match results */}
        {matchData && (
          <div className="mt-10">
            <MatchResults data={matchData} />
          </div>
        )}

        {/* No matches explanation for graduated players */}
        {playerData && !matchData && playerData.player.is_graduated && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">
              This player is no longer active. Match comparison shows active
              2025-26 players only.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </div>
      </footer>
    </div>
  );
}
