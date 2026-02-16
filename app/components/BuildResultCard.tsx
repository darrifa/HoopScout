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
      className="block bg-white rounded-xl border border-gray-200 md:border-gray-100 p-2.5 md:p-5 transition-all hover:shadow-md hover:scale-[1.01]"
    >
      {/* Line 1: rank + name + score */}
      <div className="flex items-center justify-between gap-1.5 md:gap-3">
        <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
          <span className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-gray-100 text-gray-500 text-[9px] md:text-xs font-bold flex items-center justify-center shrink-0">
            {rank}
          </span>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight truncate">
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
        <span className="text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md shrink-0 bg-green-50 text-green-700 border border-green-100">
          {result.bucket_sum}/35
        </span>
      </div>

      {/* Line 2: Team · Conf · Class · Height */}
      <p className="text-[11px] md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate pl-[26px] md:pl-10">
        {result.team}
        {result.conference && (
          <span className="text-gray-300"> &middot; </span>
        )}
        {result.conference && <span>{result.conference}</span>}
        {(result.class_year || result.height_inches) && (
          <span className="text-gray-300"> &middot; </span>
        )}
        {result.class_year && <span>{result.class_year}</span>}
        {result.class_year && result.height_inches && (
          <span className="text-gray-300"> &middot; </span>
        )}
        {result.height_inches && <span>{heightDisplay(result.height_inches)}</span>}
      </p>

      {/* Line 3: Games · USG% */}
      <p className="text-[10px] md:text-xs text-gray-400 mt-0 md:mt-0.5 pl-[26px] md:pl-10">
        <span>{result.games} games</span>
        <span className="text-gray-300"> &middot; </span>
        <span>{result.usage_rate?.toFixed(1)}% USG</span>
      </p>

      {/* Line 4: Bucket circles */}
      <div className="flex justify-between gap-1.5 md:gap-3 mt-1.5 md:mt-4 pt-0 md:pt-4 md:border-t md:border-gray-50">
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
