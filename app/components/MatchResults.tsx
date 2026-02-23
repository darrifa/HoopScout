"use client";

import { useState, useMemo } from "react";
import type { MatchesResponse } from "@/app/lib/types";
import MatchCard from "./MatchCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="text-center py-10 text-muted-foreground">
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
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-foreground">
          Top Matches
        </h3>
        <Badge variant="secondary">
          {total_candidates_evaluated} {reference.player.position_group}s evaluated
        </Badge>
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
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, matches.length))
            }
          >
            Show More ({matches.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
