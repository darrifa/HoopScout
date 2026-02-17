"use client";

import { useState, useMemo } from "react";
import type { MatchesResponse } from "@/app/lib/types";
import MatchCard from "./MatchCard";

interface Props {
  data: MatchesResponse;
}

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 10;

export default function MatchResults({ data }: Props) {
  const { matches, total_candidates_evaluated, reference } = data;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = useMemo(
    () => matches.slice(0, visibleCount),
    [matches, visibleCount]
  );

  if (matches.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-lg font-medium">No matches found</p>
        <p className="text-sm mt-1">
          Evaluated {total_candidates_evaluated} active{" "}
          {reference.player.position_group}s in the current season.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          Top Matches
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {total_candidates_evaluated} active {reference.player.position_group}s evaluated
        </p>
      </div>

      {/* Match cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-6">
        {visible.map((m) => (
          <MatchCard key={m.player_id} match={m} />
        ))}
      </div>

      {/* Load More */}
      {visibleCount < matches.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() =>
              setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, matches.length))
            }
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
          >
            Show More ({matches.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
