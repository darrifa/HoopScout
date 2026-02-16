import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const CURRENT_SEASON = "2025-26";
export const MIN_GAMES = 15;

export const BUCKET_NAMES = [
  "bucket_3pt",
  "bucket_2pt",
  "bucket_playmaking",
  "bucket_reb",
  "bucket_usage",
  "bucket_def",
  "bucket_height",
] as const;

export const BUCKET_LABELS: Record<number, string> = {
  5: "Elite",
  4: "Above Avg",
  3: "Average",
  2: "Below Avg",
  1: "Low",
};
