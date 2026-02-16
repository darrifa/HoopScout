import type { Metadata } from "next";
import type {
  PlayerDetailResponse,
  MatchesResponse,
  MatchResult,
} from "@/app/lib/types";
import {
  supabase,
  CURRENT_SEASON,
  MIN_GAMES,
  BUCKET_LABELS,
  BUCKET_NAMES,
} from "@/app/lib/supabase";
import PlayerPageClient from "@/app/components/PlayerPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchPlayerDetail(
  playerId: number
): Promise<PlayerDetailResponse | null> {
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (playerError || !player) return null;

  const { data: stats } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("season", { ascending: false })
    .limit(1);

  const latestStats = stats?.[0] ?? null;

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
            label:
              latestStats[key] != null
                ? BUCKET_LABELS[latestStats[key] as number] ?? "Unknown"
                : null,
          },
        ])
      )
    : null;

  return {
    player,
    latest_season: latestStats?.season ?? null,
    stats: latestStats,
    buckets,
  };
}

async function fetchMatches(
  playerId: number
): Promise<MatchesResponse | null> {
  const { data: refPlayer, error: refPlayerErr } = await supabase
    .from("players")
    .select("id, full_name, team, conference, position, position_group, height_inches, class_year, is_graduated")
    .eq("id", playerId)
    .single();

  if (refPlayerErr || !refPlayer) return null;

  const { data: refStatsArr } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .order("season", { ascending: false })
    .limit(1);

  if (!refStatsArr?.length) return null;

  const refStats = refStatsArr[0];

  const refBuckets: Record<string, number | null> = {};
  for (const b of BUCKET_NAMES) {
    refBuckets[b] = refStats[b] ?? null;
  }

  const { data: candidates, error: candErr } = await supabase
    .from("players")
    .select(
      "id, full_name, team, conference, class_year, height_inches, position_group"
    )
    .eq("position_group", refPlayer.position_group)
    .eq("is_graduated", false)
    .neq("id", playerId);

  if (candErr || !candidates?.length) {
    const refBucketsLabeled = Object.fromEntries(
      BUCKET_NAMES.map((b) => [
        b,
        {
          value: refBuckets[b],
          label: refBuckets[b] != null ? BUCKET_LABELS[refBuckets[b]!] : null,
        },
      ])
    );
    return {
      reference: {
        player: refPlayer,
        season: refStats.season,
        buckets: refBucketsLabeled,
      },
      match_count: 0,
      total_candidates_evaluated: 0,
      matches: [],
    };
  }

  const candidateIds = candidates.map((c) => c.id);
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));

  const allCandidateStats: Record<string, unknown>[] = [];
  const batchSize = 500;

  for (let i = 0; i < candidateIds.length; i += batchSize) {
    const batch = candidateIds.slice(i, i + batchSize);
    const { data: batchStats } = await supabase
      .from("player_stats")
      .select("*")
      .in("player_id", batch)
      .eq("season", CURRENT_SEASON)
      .gte("games", MIN_GAMES);

    if (batchStats) {
      allCandidateStats.push(...batchStats);
    }
  }

  const results: MatchResult[] = [];

  for (const cs of allCandidateStats) {
    const cand = candidateMap.get(cs.player_id as number);
    if (!cand) continue;

    let matched = 0;
    let possible = 0;
    const diffs: Record<
      string,
      { reference: number | null; candidate: number | null; match: boolean }
    > = {};

    for (const b of BUCKET_NAMES) {
      const refVal = refBuckets[b];
      const candVal = (cs as Record<string, unknown>)[b] as number | null;

      if (b === "bucket_height") {
        if (refVal == null || candVal == null) {
          diffs[b] = { reference: refVal, candidate: candVal, match: false };
          continue;
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

  results.sort((a, b) => {
    if (b.buckets_matched !== a.buckets_matched) {
      return b.buckets_matched - a.buckets_matched;
    }
    return (b.usage_rate ?? 0) - (a.usage_rate ?? 0);
  });

  const top30 = results.slice(0, 30);

  const refBucketsLabeled = Object.fromEntries(
    BUCKET_NAMES.map((b) => [
      b,
      {
        value: refBuckets[b],
        label: refBuckets[b] != null ? BUCKET_LABELS[refBuckets[b]!] : null,
      },
    ])
  );

  return {
    reference: {
      player: refPlayer,
      season: refStats.season,
      buckets: refBucketsLabeled,
    },
    match_count: top30.length,
    total_candidates_evaluated: allCandidateStats.length,
    matches: top30,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playerId = parseInt(id, 10);

  if (isNaN(playerId)) {
    return {
      title: "Player Not Found — HoopScout",
      description: "This player could not be found on HoopScout.",
    };
  }

  const { data: player } = await supabase
    .from("players")
    .select("full_name")
    .eq("id", playerId)
    .single();

  if (!player) {
    return {
      title: "Player Not Found — HoopScout",
      description: "This player could not be found on HoopScout.",
    };
  }

  const name = player.full_name;

  return {
    title: `${name} — HoopScout`,
    description: `Find D1 players with a similar statistical profile to ${name}`,
    openGraph: {
      title: `${name} — HoopScout`,
      description: `Find D1 players with a similar statistical profile to ${name}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${name} — HoopScout`,
      description: `Find D1 players with a similar statistical profile to ${name}`,
    },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;
  const playerId = parseInt(id, 10);

  if (isNaN(playerId)) {
    return <PlayerPageClient playerData={null} matchData={null} />;
  }

  const [playerData, matchData] = await Promise.all([
    fetchPlayerDetail(playerId),
    fetchMatches(playerId),
  ]);

  return <PlayerPageClient playerData={playerData} matchData={matchData} />;
}
