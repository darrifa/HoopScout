"use client";

import { useRouter } from "next/navigation";
import type { SearchResult } from "@/app/lib/types";
import SearchBar from "@/app/components/SearchBar";
import Header from "@/app/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  const handleSelect = (player: SearchResult) => {
    router.push(`/player/${player.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mt-16">
            Find Similar Players
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-lg mx-auto">
            Search any D1 college basketball player to find active players with a
            similar statistical profile
          </p>

          {/* Tab Toggle */}
          <Tabs
            defaultValue="search"
            onValueChange={(val) => {
              if (val === "build") router.push("/build");
            }}
            className="mt-8 flex-col items-center"
          >
            <TabsList>
              <TabsTrigger value="search" className="px-5">Search by Player</TabsTrigger>
              <TabsTrigger value="build" className="px-5">Build a Profile</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="text-center">
          <div className="max-w-2xl mx-auto mt-8">
            <SearchBar onSelect={handleSelect} />
          </div>

          {/* Stat cards */}
          <div className="flex justify-center gap-8 mt-16 flex-wrap">
            <Card className="px-8 py-6 text-center">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-foreground">90,000+</div>
                <div className="text-sm text-muted-foreground mt-1">Player Seasons</div>
              </CardContent>
            </Card>
            <Card className="px-8 py-6 text-center">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-foreground">19</div>
                <div className="text-sm text-muted-foreground mt-1">Years of Data</div>
              </CardContent>
            </Card>
            <Card className="px-8 py-6 text-center">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-foreground">7</div>
                <div className="text-sm text-muted-foreground mt-1">Matching Dimensions</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-16">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </p>
      </main>
    </div>
  );
}
