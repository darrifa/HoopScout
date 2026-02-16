import { NextRequest, NextResponse } from "next/server";
import { supabase, BUCKET_LABELS } from "@/app/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const playerId = parseInt(id, 10);

  if (isNaN(playerId)) {
    return NextResponse.json(
      { error: "Invalid player ID" },
      { status: 400 }
    );
  }

  // Fetch player info
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (playerError || !player) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: 404 }
    );
  }

  // Fetch most recent season stats
  const { data: stats, error: statsError } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("season", { ascending: false })
    .limit(1);

  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  const latestStats = stats?.[0] ?? null;

  // Format bucket summary
  const bucketKeys = [
    "bucket_3pt",
    "bucket_2pt",
    "bucket_playmaking",
    "bucket_reb",
    "bucket_usage",
    "bucket_def",
    "bucket_height",
  ] as const;

  const buckets = latestStats
    ? Object.fromEntries(
        bucketKeys.map((key) => [
          key,
          {
            value: latestStats[key],
            label: latestStats[key] != null
              ? BUCKET_LABELS[latestStats[key] as number] ?? "Unknown"
              : null,
          },
        ])
      )
    : null;

  return NextResponse.json({
    player,
    latest_season: latestStats?.season ?? null,
    stats: latestStats,
    buckets,
  });
}
