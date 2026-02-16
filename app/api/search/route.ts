import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing search query. Use ?q=<name>" },
      { status: 400 }
    );
  }

  const searchTerm = q.trim();

  const { data, error } = await supabase
    .from("players")
    .select(
      "id, full_name, team, conference, position_group, class_year, is_graduated"
    )
    .ilike("full_name", `%${searchTerm}%`)
    .order("full_name")
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data.length, results: data });
}
