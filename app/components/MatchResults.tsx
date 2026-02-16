"use client";

import { useMemo } from "react";
import type { MatchesResponse } from "@/app/lib/types";
import MatchCard from "./MatchCard";

interface Props {
  data: MatchesResponse;
}

export default function MatchResults({ data }: Props) {
  const { matches, total_candidates_evaluated, reference } = data;

  // Take top 20, already sorted by buckets_matched DESC then usage DESC from API
  const top20 = useMemo(() => matches.slice(0, 20), [matches]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {top20.map((m) => (
          <MatchCard key={m.player_id} match={m} />
        ))}
      </div>
    </div>
  );
}
