"use client";

import Link from "next/link";
import type { MatchResult } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";

interface Props {
  match: MatchResult;
}

export default function MatchCard({ match }: Props) {
  return (
    <Link
      href={`/player/${match.player_id}`}
      className="block bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:shadow-md transition-shadow"
    >
      {/* Row 1: Name + match badge */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
            {match.full_name}
          </h3>
          <span
            onClick={(e) => {
              e.preventDefault();
              window.open(playerSearchUrl(match.full_name, match.team), "_blank", "noopener,noreferrer");
            }}
            className="hidden sm:inline text-gray-300 hover:text-accent shrink-0 transition-colors cursor-pointer"
            title="Search on Google"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </div>
        <span
          className={`text-[11px] md:text-sm font-bold px-2 py-0.5 rounded-md shrink-0 ml-2
            ${match.buckets_matched >= 6 ? "bg-green-100 text-green-700" : ""}
            ${match.buckets_matched === 5 ? "bg-yellow-100 text-yellow-700" : ""}
            ${match.buckets_matched === 4 ? "bg-orange-100 text-orange-700" : ""}
            ${match.buckets_matched <= 3 ? "bg-gray-100 text-gray-600" : ""}
          `}
        >
          {match.match_label}
        </span>
      </div>

      {/* Row 2: Team · Conf · Class · Height */}
      <div className="text-[11px] md:text-sm text-gray-500 mb-0.5">
        {match.team}
        {match.conference ? ` \u00b7 ${match.conference}` : ""}
        {match.class_year ? ` \u00b7 ${match.class_year}` : ""}
        {match.height_inches ? ` \u00b7 ${heightDisplay(match.height_inches)}` : ""}
      </div>

      {/* Row 3: Games + usage */}
      <div className="text-[10px] md:text-xs text-gray-400 mb-2">
        {match.games} games {"\u00b7"} {match.usage_rate?.toFixed(1)}% USG
      </div>

      {/* Row 4: Bucket circles — same layout at all sizes */}
      <div className="flex justify-evenly mt-1">
        {BUCKET_CONFIG.map((bc) => {
          const diff = match.bucket_diffs[bc.key];
          const candidateVal = diff?.candidate ?? null;

          return (
            <BucketBar
              key={bc.key}
              label={bc.label}
              compactLabel={bc.compactLabel}
              bucketValue={candidateVal}
              compact
            />
          );
        })}
      </div>
    </Link>
  );
}
