import { NextRequest, NextResponse } from "next/server";
import { searchNovaPoshtaCities } from "@/shared/api/nova-poshta/client";

/* Nova Poshta cities starting with ?q=, searched with the server's key. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 60) return NextResponse.json([]);

  try {
    return NextResponse.json(await searchNovaPoshtaCities(query));
  } catch (error) {
    console.error("Nova Poshta city search failed:", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
