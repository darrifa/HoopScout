"use client";

import type { MatchResult } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";

interface Props {
  match: MatchResult;
}

export default function MatchCard({ match }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Row 1: Name + match badge */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {match.full_name}
          </h3>
          <a
            href={playerSearchUrl(match.full_name, match.team)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-accent shrink-0 transition-colors"
            title="View on Barttorvik"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <span
          className={`text-sm font-bold px-2.5 py-0.5 rounded-full shrink-0 ml-2
            ${match.buckets_matched >= 6 ? "bg-green-100 text-green-700" : ""}
            ${match.buckets_matched === 5 ? "bg-yellow-100 text-yellow-700" : ""}
            ${match.buckets_matched === 4 ? "bg-orange-100 text-orange-700" : ""}
            ${match.buckets_matched <= 3 ? "bg-gray-100 text-gray-600" : ""}
          `}
        >
          {match.match_label}
        </span>
      </div>

      {/* Row 2: Team, conference, class, height */}
      <p className="text-sm text-gray-500 mt-1">
        {match.team}
        {match.conference ? ` \u00b7 ${match.conference}` : ""}
        {match.class_year ? ` \u00b7 ${match.class_year}` : ""}
        {match.height_inches ? ` \u00b7 ${heightDisplay(match.height_inches)}` : ""}
      </p>

      {/* Row 3: Games + usage */}
      <p className="text-xs text-gray-400 mt-1 mb-4">
        {match.games} games {"\u00b7"} {match.usage_rate?.toFixed(1)}% USG
      </p>

      {/* Compact bucket dots */}
      <div className="flex justify-between mt-4">
        {BUCKET_CONFIG.map((bc) => {
          const diff = match.bucket_diffs[bc.key];
          const candidateVal = diff?.candidate ?? null;
          const isMatch = diff?.match ?? false;
          const isDiff = diff ? !isMatch : false;

          return (
            <BucketBar
              key={bc.key}
              label={bc.label}
              compactLabel={bc.compactLabel}
              bucketValue={candidateVal}
              isDiff={isDiff}
              compact
            />
          );
        })}
      </div>
    </div>
  );
}
