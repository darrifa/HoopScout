import { NextRequest, NextResponse } from "next/server";
import {
  supabase,
  CURRENT_SEASON,
  MIN_GAMES,
  BUCKET_NAMES,
} from "@/app/lib/supabase";
import type { BuildSearchResult } from "@/app/lib/types";

const VALID_POSITIONS = new Set(["Guard", "Wing", "Big"]);

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  // ── Validate position group ──
  const positionGroup = sp.get("position_group");
  if (!positionGroup || !VALID_POSITIONS.has(positionGroup)) {
    return NextResponse.json(
      { error: "Invalid or missing position_group. Must be Guard, Wing, or Big." },
      { status: 400 }
    );
  }

  // ── Parse bucket minimums ──
  const bucketMins: Record<string, number> = {};
  for (const b of BUCKET_NAMES) {
    const raw = sp.get(b);
    if (raw) {
      const val = parseInt(raw, 10);
      if (!isNaN(val) && val >= 2 && val <= 5) {
        bucketMins[b] = val;
      }
    }
  }

  // ── Parse pagination ──
  const offset = Math.max(0, parseInt(sp.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20", 10) || 20));

  // ── Build Supabase query ──
  // Join player_stats with players via inner join
  let query = supabase
    .from("player_stats")
    .select(
      `
      player_id, season, games, minutes_pg, usage_rate,
      bucket_3pt, bucket_2pt, bucket_playmaking,
      bucket_reb, bucket_usage, bucket_def, bucket_height,
      players!inner (
        id, full_name, team, conference, position, position_group,
        height_inches, class_year, is_graduated
      )
    `
    )
    .eq("season", CURRENT_SEASON)
    .gte("games", MIN_GAMES)
    .eq("players.is_graduated", false)
    .eq("players.position_group", positionGroup);

  // Apply bucket minimum filters
  for (const [bucketName, minVal] of Object.entries(bucketMins)) {
    query = query.gte(bucketName, minVal);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ total_count: 0, results: [] });
  }

  // ── Transform and compute bucket_sum ──
  const results: BuildSearchResult[] = data.map((row) => {
    // Supabase returns the joined table as an object (not array) for !inner
    const p = row.players as unknown as Record<string, unknown>;

    const bucketValues = [
      row.bucket_3pt,
      row.bucket_2pt,
      row.bucket_playmaking,
      row.bucket_reb,
      row.bucket_usage,
      row.bucket_def,
      row.bucket_height,
    ];
    const bucketSum = bucketValues.reduce(
      (sum: number, v) => sum + ((v as number) ?? 0),
      0
    );

    return {
      player_id: p.id as number,
      full_name: p.full_name as string,
      team: p.team as string,
      conference: (p.conference as string | null) ?? null,
      position: (p.position as string | null) ?? null,
      position_group: p.position_group as string,
      height_inches: (p.height_inches as number | null) ?? null,
      class_year: (p.class_year as string | null) ?? null,
      games: row.games as number,
      minutes_pg: (row.minutes_pg as number | null) ?? null,
      usage_rate: (row.usage_rate as number | null) ?? null,
      bucket_3pt: (row.bucket_3pt as number | null) ?? null,
      bucket_2pt: (row.bucket_2pt as number | null) ?? null,
      bucket_playmaking: (row.bucket_playmaking as number | null) ?? null,
      bucket_reb: (row.bucket_reb as number | null) ?? null,
      bucket_usage: (row.bucket_usage as number | null) ?? null,
      bucket_def: (row.bucket_def as number | null) ?? null,
      bucket_height: (row.bucket_height as number | null) ?? null,
      bucket_sum: bucketSum,
    };
  });

  // ── Sort by bucket_sum DESC, then usage_rate DESC ──
  results.sort((a, b) => {
    if (b.bucket_sum !== a.bucket_sum) return b.bucket_sum - a.bucket_sum;
    return (b.usage_rate ?? 0) - (a.usage_rate ?? 0);
  });

  const totalCount = results.length;
  const paged = results.slice(offset, offset + limit);

  return NextResponse.json({
    total_count: totalCount,
    results: paged,
  });
}
