"use client";

import { useRouter } from "next/navigation";
import ProfileBuilder from "@/app/components/ProfileBuilder";
import Header from "@/app/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuildPage() {
  const router = useRouter();

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
            Define minimum thresholds across 7 dimensions to find active D1
            players that match your criteria
          </p>

          {/* Tab Toggle */}
          <Tabs
            defaultValue="build"
            onValueChange={(val) => {
              if (val === "search") router.push("/");
            }}
            className="mt-8 flex-col items-center"
          >
            <TabsList>
              <TabsTrigger value="search" className="px-5">Search by Player</TabsTrigger>
              <TabsTrigger value="build" className="px-5">Build a Profile</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-8">
          <ProfileBuilder />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-16">
          Data sourced from Barttorvik &middot; 2007-08 through 2025-26 seasons
        </p>
      </main>
    </div>
  );
}
