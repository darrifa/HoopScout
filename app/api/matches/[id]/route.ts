import { NextRequest, NextResponse } from "next/server";
import {
  supabase,
  CURRENT_SEASON,
  MIN_GAMES,
  BUCKET_LABELS,
  BUCKET_NAMES,
} from "@/app/lib/supabase";

interface MatchResult {
  player_id: number;
  full_name: string;
  team: string;
  conference: string | null;
  class_year: string | null;
  height_inches: number | null;
  position_group: string;
  season: string;
  games: number;
  minutes_pg: number | null;
  usage_rate: number | null;
  // Raw stats
  three_pt_attempts_pg: number | null;
  three_pt_pct: number | null;
  two_pt_attempts_pg: number | null;
  two_pt_pct: number | null;
  ast_pg: number | null;
  tov_pg: number | null;
  ast_to_ratio: number | null;
  oreb_pg: number | null;
  dreb_pg: number | null;
  rpg: number | null;
  adj_de: number | null;
  three_pt_score: number | null;
  two_pt_score: number | null;
  // Buckets
  bucket_3pt: number | null;
  bucket_2pt: number | null;
  bucket_playmaking: number | null;
  bucket_reb: number | null;
  bucket_usage: number | null;
  bucket_def: number | null;
  bucket_height: number | null;
  // Match info
  buckets_matched: number;
  buckets_possible: number;
  match_label: string;
  bucket_diffs: Record<string, { reference: number | null; candidate: number | null; match: boolean }>;
}

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

  // ── 1. Get reference player info ──
  const { data: refPlayer, error: refPlayerErr } = await supabase
    .from("players")
    .select("id, full_name, team, position_group, height_inches, is_graduated")
    .eq("id", playerId)
    .single();

  if (refPlayerErr || !refPlayer) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  // ── 2. Get reference player's most recent season stats ──
  const { data: refStatsArr, error: refStatsErr } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("season", { ascending: false })
    .limit(1);

  if (refStatsErr || !refStatsArr?.length) {
    return NextResponse.json(
      { error: "No stats found for this player" },
      { status: 404 }
    );
  }

  const refStats = refStatsArr[0];

  // Extract reference buckets
  const refBuckets: Record<string, number | null> = {};
  for (const b of BUCKET_NAMES) {
    refBuckets[b] = refStats[b] ?? null;
  }

  // ── 3. Find active candidates in same position group ──
  //    Get all active (is_graduated=false) players in same position_group
  const { data: candidates, error: candErr } = await supabase
    .from("players")
    .select("id, full_name, team, conference, class_year, height_inches, position_group")
    .eq("position_group", refPlayer.position_group)
    .eq("is_graduated", false)
    .neq("id", playerId);

  if (candErr) {
    return NextResponse.json({ error: candErr.message }, { status: 500 });
  }

  if (!candidates?.length) {
    return NextResponse.json({
      reference: { player: refPlayer, stats: refStats, buckets: refBuckets },
      matches: [],
      message: "No active candidates found in this position group",
    });
  }

  // ── 4. Get current season stats for all candidates ──
  //    Fetch in batches of 500 player IDs
  const candidateIds = candidates.map((c) => c.id);
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));

  const allCandidateStats: Record<string, unknown>[] = [];
  const batchSize = 500;

  for (let i = 0; i < candidateIds.length; i += batchSize) {
    const batch = candidateIds.slice(i, i + batchSize);
    const { data: batchStats, error: batchErr } = await supabase
      .from("player_stats")
      .select("*")
      .in("player_id", batch)
      .eq("season", CURRENT_SEASON)
      .gte("games", MIN_GAMES);

    if (batchErr) {
      return NextResponse.json({ error: batchErr.message }, { status: 500 });
    }

    if (batchStats) {
      allCandidateStats.push(...batchStats);
    }
  }

  // ── 5. Compute matches ──
  const results: MatchResult[] = [];

  for (const cs of allCandidateStats) {
    const cand = candidateMap.get(cs.player_id as number);
    if (!cand) continue;

    let matched = 0;
    let possible = 0;
    const diffs: Record<string, { reference: number | null; candidate: number | null; match: boolean }> = {};

    for (const b of BUCKET_NAMES) {
      const refVal = refBuckets[b];
      const candVal = (cs as Record<string, unknown>)[b] as number | null;

      if (b === "bucket_height") {
        // If either side is NULL, exclude from match count
        if (refVal == null || candVal == null) {
          diffs[b] = { reference: refVal, candidate: candVal, match: false };
          continue; // don't count toward possible
        }
      }

      possible++;
      const isMatch = refVal != null && candVal != null && refVal === candVal;
      if (isMatch) matched++;

      diffs[b] = { reference: refVal, candidate: candVal, match: isMatch };
    }

    results.push({
      player_id: cand.id,
      full_name: cand.full_name,
      team: cand.team,
      conference: cand.conference,
      class_year: cand.class_year,
      height_inches: cand.height_inches,
      position_group: cand.position_group,
      season: cs.season as string,
      games: cs.games as number,
      minutes_pg: cs.minutes_pg as number | null,
      usage_rate: cs.usage_rate as number | null,
      three_pt_attempts_pg: cs.three_pt_attempts_pg as number | null,
      three_pt_pct: cs.three_pt_pct as number | null,
      two_pt_attempts_pg: cs.two_pt_attempts_pg as number | null,
      two_pt_pct: cs.two_pt_pct as number | null,
      ast_pg: cs.ast_pg as number | null,
      tov_pg: cs.tov_pg as number | null,
      ast_to_ratio: cs.ast_to_ratio as number | null,
      oreb_pg: cs.oreb_pg as number | null,
      dreb_pg: cs.dreb_pg as number | null,
      rpg: cs.rpg as number | null,
      adj_de: cs.adj_de as number | null,
      three_pt_score: cs.three_pt_score as number | null,
      two_pt_score: cs.two_pt_score as number | null,
      bucket_3pt: cs.bucket_3pt as number | null,
      bucket_2pt: cs.bucket_2pt as number | null,
      bucket_playmaking: cs.bucket_playmaking as number | null,
      bucket_reb: cs.bucket_reb as number | null,
      bucket_usage: cs.bucket_usage as number | null,
      bucket_def: cs.bucket_def as number | null,
      bucket_height: cs.bucket_height as number | null,
      buckets_matched: matched,
      buckets_possible: possible,
      match_label: `${matched}/${possible}`,
      bucket_diffs: diffs,
    });
  }

  // Sort by buckets_matched DESC, then usage_rate DESC
  results.sort((a, b) => {
    if (b.buckets_matched !== a.buckets_matched) {
      return b.buckets_matched - a.buckets_matched;
    }
    return (b.usage_rate ?? 0) - (a.usage_rate ?? 0);
  });

  // Top 30
  const top30 = results.slice(0, 30);

  // Format reference buckets with labels
  const refBucketsLabeled = Object.fromEntries(
    BUCKET_NAMES.map((b) => [
      b,
      {
        value: refBuckets[b],
        label: refBuckets[b] != null ? BUCKET_LABELS[refBuckets[b]!] : null,
      },
    ])
  );

  return NextResponse.json({
    reference: {
      player: refPlayer,
      season: refStats.season,
      buckets: refBucketsLabeled,
    },
    match_count: top30.length,
    total_candidates_evaluated: allCandidateStats.length,
    matches: top30,
  });
}
