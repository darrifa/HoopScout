"use client";

import type { PlayerDetailResponse } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";

interface Props {
  data: PlayerDetailResponse;
}

export default function PlayerCard({ data }: Props) {
  const { player, latest_season, stats } = data;

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {player.full_name}
              </h2>
              <a
                href={playerSearchUrl(player.full_name, player.team)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white shrink-0 transition-colors"
                title="View on Barttorvik"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <p className="text-gray-300 text-sm mt-0.5">
              {player.team}
              {player.conference ? ` \u00b7 ${player.conference}` : ""}
              {player.class_year ? ` \u00b7 ${player.class_year}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 sm:mt-0">
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {player.position_group}
            </span>
            {player.height_inches && (
              <span className="text-white text-sm font-medium">
                {heightDisplay(player.height_inches)}
              </span>
            )}
          </div>
        </div>
        {latest_season && (
          <p className="text-gray-400 text-xs mt-2">
            Stats from {latest_season}
            {stats ? ` \u00b7 ${stats.games} games \u00b7 ${stats.minutes_pg?.toFixed(1)} min/g` : ""}
            {player.is_graduated ? " \u00b7 No longer active" : ""}
          </p>
        )}
      </div>

      {/* Bucket bars */}
      <div className="p-6">
        {stats ? (
          <div className="space-y-4">
            {BUCKET_CONFIG.map((bc) => {
              const bucketVal = stats[bc.key as keyof typeof stats] as number | null;
              const raw =
                bc.key === "bucket_height"
                  ? bc.formatStat(stats, player.height_inches)
                  : bc.formatStat(stats);
              return (
                <BucketBar
                  key={bc.key}
                  label={bc.label}
                  bucketValue={bucketVal}
                  rawStatText={raw}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-6 text-center">
            No stats available for this player.
          </p>
        )}
      </div>
    </div>
  );
}
