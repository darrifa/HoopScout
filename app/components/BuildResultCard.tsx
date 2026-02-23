"use client";

import Link from "next/link";
import type { BuildSearchResult } from "@/app/lib/types";
import { BUCKET_CONFIG, heightDisplay, playerSearchUrl } from "@/app/lib/types";
import BucketBar from "./BucketBar";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface Props {
  result: BuildSearchResult;
  rank: number;
  /** bucket_key -> minimum value the user set */
  criteria: Record<string, number>;
}

export default function BuildResultCard({ result, rank, criteria }: Props) {
  return (
    <Link href={`/player/${result.player_id}`} className="block">
      <Card size="sm" className="transition-all hover:shadow-md hover:scale-[1.01]">
        <CardContent>
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
                <ExternalLink className="size-3.5" />
              </span>
            </div>
            {/* === Data-meaning color: DO NOT convert to theme tokens === */}
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

          {/* Row 4: Bucket circles */}
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
        </CardContent>
      </Card>
    </Link>
  );
}
