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
      className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      {/* Row 1: Rank + Name + position badge */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
            {rank}
          </span>
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {result.full_name}
          </h3>
          <span
            onClick={(e) => {
              e.preventDefault();
              window.open(
                playerSearchUrl(result.full_name, result.team),
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="text-gray-300 hover:text-accent shrink-0 transition-colors cursor-pointer"
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
        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full shrink-0 ml-2 bg-green-50 text-green-700">
          {result.bucket_sum}/35
        </span>
      </div>

      {/* Row 2: Team, conference, class, height */}
      <p className="text-sm text-gray-500 mt-1 ml-8">
        {result.team}
        {result.conference ? ` \u00b7 ${result.conference}` : ""}
        {result.class_year ? ` \u00b7 ${result.class_year}` : ""}
        {result.height_inches ? ` \u00b7 ${heightDisplay(result.height_inches)}` : ""}
      </p>

      {/* Row 3: Games + usage */}
      <p className="text-xs text-gray-400 mt-1 mb-4 ml-8">
        {result.games} games {"\u00b7"} {result.usage_rate?.toFixed(1)}% USG
      </p>

      {/* Compact bucket dots */}
      <div className="flex justify-between mt-4">
        {BUCKET_CONFIG.map((bc) => {
          const val = result[bc.key as keyof BuildSearchResult] as number | null;
          const min = criteria[bc.key];
          const meetsFloor = min != null && val != null && val >= min;

          return (
            <BucketBar
              key={bc.key}
              label={bc.label}
              compactLabel={bc.compactLabel}
              bucketValue={val}
              isHighlight={meetsFloor}
              compact
            />
          );
        })}
      </div>
    </Link>
  );
}
