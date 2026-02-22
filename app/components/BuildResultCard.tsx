"use client";

import Link from "next/link";
import type { BuildSearchResult } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";

interface Props {
  result: BuildSearchResult;
  rank: number;
  /** bucket_key -> minimum value the user set */
  criteria: Record<string, number>;
}

export default function BuildResultCard({ result, rank, criteria }: Props) {
  return (
    <Link
      href={`/player/${result.player_id}`}
      className="block bg-card rounded-lg border border-border p-3 md:p-5 transition-all hover:shadow-md hover:scale-[1.01]"
    >
      {/* Row 1: Rank + Name + Score */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground font-medium shrink-0">{rank}</span>
          <span className="font-semibold text-sm md:text-base text-foreground truncate">
            {result.full_name}
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              window.open(
                playerSearchUrl(result.full_name, result.team),
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="hidden sm:inline text-muted-foreground/40 hover:text-accent shrink-0 transition-colors cursor-pointer"
            title="Search on Google"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </span>
        </div>
        <span className="text-[11px] md:text-sm font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md shrink-0 ml-2">
          {result.bucket_sum}/35
        </span>
      </div>

      {/* Row 2: Team · Conf · Class · Height */}
      <div className="text-[11px] md:text-sm text-muted-foreground mb-0.5 pl-5 md:pl-6 truncate">
        {result.team}
        {result.conference && ` \u00b7 ${result.conference}`}
        {result.class_year && ` \u00b7 ${result.class_year}`}
        {result.height_inches && ` \u00b7 ${heightDisplay(result.height_inches)}`}
      </div>

      {/* Row 3: Games · USG% */}
      <div className="text-[10px] md:text-xs text-muted-foreground mb-2 pl-5 md:pl-6">
        {result.games} games &middot; {result.usage_rate?.toFixed(1)}% USG
      </div>

      {/* Row 4: Bucket circles — same layout at all sizes, just scaled */}
      <div className="flex justify-evenly mt-1">
        {BUCKET_CONFIG.map((bc) => {
          const val = result[bc.key as keyof BuildSearchResult] as number | null;
          return (
            <BucketBar
              key={bc.key}
              label={bc.label}
              compactLabel={bc.compactLabel}
              bucketValue={val}
              compact
            />
          );
        })}
      </div>
    </Link>
  );
}
