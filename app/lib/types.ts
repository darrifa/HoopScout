/* ── Shared types for HoopScout frontend ── */

export interface SearchResult {
  id: number;
  full_name: string;
  team: string;
  conference: string | null;
  position_group: string;
  class_year: string | null;
  is_graduated: boolean;
}

export interface PlayerInfo {
  id: number;
  full_name: string;
  team: string;
  conference: string | null;
  position: string | null;
  position_group: string;
  height_inches: number | null;
  class_year: string | null;
  is_graduated: boolean;
}

export interface PlayerStats {
  season: string;
  games: number;
  minutes_pg: number | null;
  usage_rate: number | null;
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
  bucket_3pt: number | null;
  bucket_2pt: number | null;
  bucket_playmaking: number | null;
  bucket_reb: number | null;
  bucket_usage: number | null;
  bucket_def: number | null;
  bucket_height: number | null;
}

export interface BucketValue {
  value: number | null;
  label: string | null;
}

export interface PlayerDetailResponse {
  player: PlayerInfo;
  latest_season: string | null;
  stats: PlayerStats | null;
  buckets: Record<string, BucketValue> | null;
}

export interface BucketDiff {
  reference: number | null;
  candidate: number | null;
  match: boolean;
}

export interface MatchResult {
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
  bucket_3pt: number | null;
  bucket_2pt: number | null;
  bucket_playmaking: number | null;
  bucket_reb: number | null;
  bucket_usage: number | null;
  bucket_def: number | null;
  bucket_height: number | null;
  buckets_matched: number;
  buckets_possible: number;
  match_label: string;
  bucket_diffs: Record<string, BucketDiff>;
}

export interface MatchesResponse {
  reference: {
    player: PlayerInfo;
    season: string;
    buckets: Record<string, BucketValue>;
  };
  match_count: number;
  total_candidates_evaluated: number;
  matches: MatchResult[];
}

/* ── Bucket display metadata ── */

export const BUCKET_CONFIG = [
  {
    key: "bucket_3pt",
    label: "3PT Shooting",
    compactLabel: "3PT",
    tooltip: "Combines 3PT attempts per game and 3PT% into a single volume-adjusted score, ranked within position group.",
    statKey: "three_pt_score",
    formatStat: (s: PlayerStats) => {
      const att = s.three_pt_attempts_pg;
      const pct = s.three_pt_pct;
      const score = s.three_pt_score;
      if (score == null || att == null || pct == null) return "\u2014";
      return `${score.toFixed(1)} (${att.toFixed(1)} 3PA \u00d7 ${(pct * 100).toFixed(0)}%)`;
    },
  },
  {
    key: "bucket_2pt",
    label: "2PT Shooting",
    compactLabel: "2PT",
    tooltip: "Combines 2PT attempts per game and 2PT% into a single volume-adjusted score, ranked within position group.",
    statKey: "two_pt_score",
    formatStat: (s: PlayerStats) => {
      const att = s.two_pt_attempts_pg;
      const pct = s.two_pt_pct;
      const score = s.two_pt_score;
      if (score == null || att == null || pct == null) return "\u2014";
      return `${score.toFixed(1)} (${att.toFixed(1)} 2PA \u00d7 ${(pct * 100).toFixed(0)}%)`;
    },
  },
  {
    key: "bucket_playmaking",
    label: "Playmaking",
    compactLabel: "Play",
    tooltip: "Based on assist-to-turnover ratio, ranked within position group.",
    statKey: "ast_to_ratio",
    formatStat: (s: PlayerStats) => {
      const ast = s.ast_pg;
      const tov = s.tov_pg;
      const ratio = s.ast_to_ratio;
      if (ratio == null) return "\u2014";
      return `${ratio.toFixed(2)} A/TO (${ast?.toFixed(1) ?? "?"} ast, ${tov?.toFixed(1) ?? "?"} tov)`;
    },
  },
  {
    key: "bucket_reb",
    label: "Rebounds",
    compactLabel: "REB",
    tooltip: "Total rebounds per game, ranked within position group.",
    statKey: "rpg",
    formatStat: (s: PlayerStats) => {
      const v = s.rpg;
      return v != null ? `${v.toFixed(1)} RPG` : "\u2014";
    },
  },
  {
    key: "bucket_usage",
    label: "Usage",
    compactLabel: "USG",
    tooltip: "Percentage of team possessions used while on the floor, ranked within position group.",
    statKey: "usage_rate",
    formatStat: (s: PlayerStats) => {
      const v = s.usage_rate;
      return v != null ? `${v.toFixed(1)}% USG` : "\u2014";
    },
  },
  {
    key: "bucket_def",
    label: "Defense",
    compactLabel: "DEF",
    tooltip: "Adjusted defensive efficiency — points allowed per 100 possessions, ranked within position group (lower is better).",
    statKey: "adj_de",
    formatStat: (s: PlayerStats) => {
      const v = s.adj_de;
      return v != null ? `${v.toFixed(1)} Adj DE \u2193` : "\u2014";
    },
  },
  {
    key: "bucket_height",
    label: "Height",
    compactLabel: "HGT",
    tooltip: "Listed height, ranked within position group.",
    statKey: "height_inches",
    formatStat: (_s: PlayerStats, heightInches?: number | null) => {
      if (heightInches == null) return "\u2014";
      const ft = Math.floor(heightInches / 12);
      const inches = Math.round(heightInches % 12);
      return `${ft}'${inches}"`;
    },
  },
] as const;

export const BUCKET_LABEL_MAP: Record<number, string> = {
  5: "Elite",
  4: "Above Avg",
  3: "Average",
  2: "Below Avg",
  1: "Low",
};

export function heightDisplay(inches: number | null): string {
  if (inches == null) return "\u2014";
  const ft = Math.floor(inches / 12);
  const rem = Math.round(inches % 12);
  return `${ft}'${rem}"`;
}

export function playerSearchUrl(playerName: string, team: string): string {
  const q = `${playerName} ${team} college basketball`.replace(/ /g, "+");
  return `https://www.google.com/search?q=${q}`;
}

/* ── Profile Builder types ── */

export const POSITION_GROUPS = ["Guard", "Wing", "Big"] as const;
export type PositionGroup = (typeof POSITION_GROUPS)[number];

export interface BuildSearchResult {
  player_id: number;
  full_name: string;
  team: string;
  conference: string | null;
  position: string | null;
  position_group: string;
  height_inches: number | null;
  class_year: string | null;
  games: number;
  minutes_pg: number | null;
  usage_rate: number | null;
  bucket_3pt: number | null;
  bucket_2pt: number | null;
  bucket_playmaking: number | null;
  bucket_reb: number | null;
  bucket_usage: number | null;
  bucket_def: number | null;
  bucket_height: number | null;
  bucket_sum: number;
}

export interface BuildSearchResponse {
  total_count: number;
  results: BuildSearchResult[];
}
