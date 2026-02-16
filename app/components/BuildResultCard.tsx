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
      className="block bg-white rounded-xl border border-gray-100 p-3 md:p-5 transition-all hover:shadow-md hover:scale-[1.01]"
    >
      {/* Top section: rank + name + score */}
      <div className="flex items-center justify-between gap-2 md:gap-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-100 text-gray-500 text-[10px] md:text-xs font-bold flex items-center justify-center shrink-0">
            {rank}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug truncate">
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
                className="hidden sm:inline text-gray-300 hover:text-accent shrink-0 transition-colors cursor-pointer"
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
            {/* Meta line — combined on mobile, two lines on desktop */}
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 truncate">
              {result.team}
              {result.conference && (
                <span className="text-gray-300"> &middot; </span>
              )}
              {result.conference && (
                <span>{result.conference}</span>
              )}
              {(result.class_year || result.height_inches) && (
                <span className="text-gray-300"> &middot; </span>
              )}
              {result.class_year && <span>{result.class_year}</span>}
              {result.class_year && result.height_inches && (
                <span className="text-gray-300"> &middot; </span>
              )}
              {result.height_inches && (
                <span>{heightDisplay(result.height_inches)}</span>
              )}
            </p>
            {/* Stats line */}
            <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">
              <span>{result.games} games</span>
              <span className="text-gray-300"> &middot; </span>
              <span>{result.usage_rate?.toFixed(1)}% USG</span>
            </p>
          </div>
        </div>

        {/* Score badge */}
        <span className="text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md shrink-0 bg-green-50 text-green-700 border border-green-100">
          {result.bucket_sum}/35
        </span>
      </div>

      {/* Bucket dots */}
      <div className="flex justify-between gap-1 md:gap-3 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-50">
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
