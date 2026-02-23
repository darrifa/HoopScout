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
import Header from "@/app/components/Header";

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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Compact search bar */}
        <SearchBar onSelect={handleSelect} compact />

        {/* Error / not found */}
        {!playerData && (
          <div className="flex flex-col items-center justify-center py-32">
            <h2 className="text-2xl font-semibold text-foreground">
              Airball...
            </h2>
            <p className="text-muted-foreground mt-2">
              This player ID doesn&apos;t exist
            </p>
            <Link
              href="/"
              className="mt-6 text-accent hover:text-accent-light transition-colors font-medium"
            >
              Return to home court
            </Link>
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
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              This player is no longer active. Match comparison shows active
              2025-26 players only.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-6 py-4 text-center text-xs text-muted-foreground">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </div>
      </footer>
    </div>
  );
}
