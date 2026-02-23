"use client";

import { useState, useCallback } from "react";
import {
  BUCKET_CONFIG,
  POSITION_GROUPS,
  type PositionGroup,
  type BuildSearchResult,
  type BuildSearchResponse,
} from "@/app/lib/types";
import DimensionScale from "./DimensionScale";
import BuildResultCard from "./BuildResultCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const LIMIT = 20;

export default function ProfileBuilder() {
  const [positionGroup, setPositionGroup] = useState<PositionGroup | null>(
    null
  );
  const [minimums, setMinimums] = useState<Record<string, number>>({});
  const [results, setResults] = useState<BuildSearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);

  const activeCount = Object.keys(minimums).length;
  const canSearch = positionGroup !== null && activeCount > 0;

  const buildParams = useCallback(
    (off: number) => {
      const params = new URLSearchParams();
      params.set("position_group", positionGroup!);
      for (const [key, val] of Object.entries(minimums)) {
        params.set(key, String(val));
      }
      params.set("offset", String(off));
      params.set("limit", String(LIMIT));
      return params;
    },
    [positionGroup, minimums]
  );

  const handleSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setHasSearched(true);
    setOffset(0);

    try {
      const res = await fetch(`/api/build-search?${buildParams(0)}`);
      const data: BuildSearchResponse = await res.json();
      setResults(data.results);
      setTotalCount(data.total_count);
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const newOffset = offset + LIMIT;
    setLoadingMore(true);
    setOffset(newOffset);

    try {
      const res = await fetch(`/api/build-search?${buildParams(newOffset)}`);
      const data: BuildSearchResponse = await res.json();
      setResults((prev) => [...prev, ...data.results]);
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  };

  const handleReset = () => {
    setMinimums({});
    setPositionGroup(null);
    setHasSearched(false);
    setResults([]);
    setTotalCount(0);
  };

  const handleDimensionChange = (key: string, val: number) => {
    setMinimums((prev) => {
      const next = { ...prev };
      if (val === 0) {
        delete next[key];
      } else {
        next[key] = val;
      }
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          Build a Player Profile
        </h3>
        <p className="text-muted-foreground mt-1">
          Set minimum thresholds — find active players who meet your floor
        </p>
      </div>

      {/* Position Selector */}
      <Card className="mb-4">
        <CardContent>
          <div className="text-sm font-medium text-foreground mb-3">
            Position Group
          </div>
          <div className="flex gap-2">
            {POSITION_GROUPS.map((pos) => (
              <Button
                key={pos}
                onClick={() => setPositionGroup(pos)}
                variant={positionGroup === pos ? "default" : "outline"}
                className="flex-1 py-2.5 cursor-pointer"
              >
                {pos}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scales */}
      <Card className="px-5 py-0 divide-y divide-border/50">
        {BUCKET_CONFIG.map((bc) => (
          <DimensionScale
            key={bc.key}
            label={bc.label}
            tooltip={bc.tooltip}
            value={minimums[bc.key] ?? 0}
            onChange={(val) => handleDimensionChange(bc.key, val)}
          />
        ))}
      </Card>

      {/* Summary Bar */}
      {activeCount > 0 && (
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div className="text-sm text-primary">
            <span className="font-semibold">Your criteria:</span>{" "}
            {BUCKET_CONFIG.filter((bc) => minimums[bc.key] != null)
              .map((bc) => {
                const v = minimums[bc.key];
                const label = v === 5 ? "5" : `${v}+`;
                return `${bc.label} \u2265 ${label}`;
              })
              .join("  \u00b7  ")}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-5">
        {(activeCount > 0 || positionGroup) && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="px-5 cursor-pointer"
          >
            Reset
          </Button>
        )}
        <Button
          onClick={handleSearch}
          disabled={!canSearch}
          size="lg"
          className="flex-1 cursor-pointer"
        >
          {canSearch
            ? `Find ${positionGroup}s matching ${activeCount} ${activeCount === 1 ? "criterion" : "criteria"}`
            : "Set a position and at least one minimum"}
        </Button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="mt-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="size-10 text-accent" />
              <p className="text-sm text-muted-foreground">Searching players...</p>
            </div>
          ) : (
            <>
              {/* Count header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Matching Players
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalCount} active {positionGroup?.toLowerCase()}
                  {totalCount !== 1 ? "s" : ""} meet your minimums
                </p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p className="text-lg font-medium">No players found</p>
                  <p className="text-sm mt-1">
                    Try lowering some thresholds or choosing a different position
                    group.
                  </p>
                </div>
              ) : (
                <>
                  {/* Results grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {results.map((r, i) => (
                      <BuildResultCard
                        key={r.player_id}
                        result={r}
                        rank={i + 1}
                        criteria={minimums}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {results.length < totalCount && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        size="lg"
                        className="cursor-pointer"
                      >
                        {loadingMore
                          ? "Loading..."
                          : `Show More (${totalCount - results.length} remaining)`}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
