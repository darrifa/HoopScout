"use client";

import Link from "next/link";
import type { MatchResult } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface Props {
  match: MatchResult;
}

/* === Data-meaning colors: DO NOT convert to theme tokens === */
function matchBadgeClasses(matched: number): string {
  if (matched >= 6) return "bg-green-100 text-green-700";
  if (matched === 5) return "bg-yellow-100 text-yellow-700";
  if (matched === 4) return "bg-orange-100 text-orange-700";
  return "bg-muted text-muted-foreground";
}
/* ========================================================== */

export default function MatchCard({ match }: Props) {
  return (
    <Link href={`/player/${match.player_id}`} className="block">
      <Card size="sm" className="hover:shadow-md transition-shadow">
        <CardContent>
          {/* Row 1: Name + match badge */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                {match.full_name}
              </h3>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  window.open(playerSearchUrl(match.full_name, match.team), "_blank", "noopener,noreferrer");
                }}
                className="hidden sm:inline text-muted-foreground/40 hover:text-accent shrink-0 transition-colors cursor-pointer"
                title="Search on Google"
              >
                <ExternalLink className="size-3.5" />
              </span>
            </div>
            <span
              className={`text-[11px] md:text-sm font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${matchBadgeClasses(match.buckets_matched)}`}
            >
              {match.match_label}
            </span>
          </div>

          {/* Row 2: Team · Conf · Class · Height */}
          <div className="text-[11px] md:text-sm text-muted-foreground mb-0.5">
            {match.team}
            {match.conference ? ` \u00b7 ${match.conference}` : ""}
            {match.class_year ? ` \u00b7 ${match.class_year}` : ""}
            {match.height_inches ? ` \u00b7 ${heightDisplay(match.height_inches)}` : ""}
          </div>

          {/* Row 3: Games + usage */}
          <div className="text-[10px] md:text-xs text-muted-foreground mb-2">
            {match.games} games {"\u00b7"} {match.usage_rate?.toFixed(1)}% USG
          </div>

          {/* Row 4: Bucket circles */}
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
        </CardContent>
      </Card>
    </Link>
  );
}
