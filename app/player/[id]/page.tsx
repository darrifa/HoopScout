import type { Metadata } from "next";
import type { PlayerDetailResponse, MatchesResponse } from "@/app/lib/types";
import PlayerPageClient from "@/app/components/PlayerPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3456";
}

async function fetchPlayerData(id: string): Promise<{
  playerData: PlayerDetailResponse | null;
  matchData: MatchesResponse | null;
}> {
  const baseUrl = getBaseUrl();

  const [playerRes, matchesRes] = await Promise.all([
    fetch(`${baseUrl}/api/player/${id}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/matches/${id}`, { cache: "no-store" }),
  ]);

  const playerData: PlayerDetailResponse | null = playerRes.ok
    ? await playerRes.json()
    : null;

  const matchData: MatchesResponse | null = matchesRes.ok
    ? await matchesRes.json()
    : null;

  return { playerData, matchData };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/player/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return {
      title: "Player Not Found — HoopScout",
      description: "This player could not be found on HoopScout.",
    };
  }

  const data: PlayerDetailResponse = await res.json();
  const name = data.player.full_name;

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
  const { playerData, matchData } = await fetchPlayerData(id);

  return <PlayerPageClient playerData={playerData} matchData={matchData} />;
}
