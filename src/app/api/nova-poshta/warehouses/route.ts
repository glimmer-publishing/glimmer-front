import { NextRequest, NextResponse } from "next/server";
import { getNovaPoshtaWarehouses } from "@/shared/api/nova-poshta/client";

/* Nova Poshta branches and parcel lockers of the city ?cityRef=. */
export async function GET(request: NextRequest) {
  const cityRef = request.nextUrl.searchParams.get("cityRef") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(cityRef)) return NextResponse.json([]);

  try {
    return NextResponse.json(await getNovaPoshtaWarehouses(cityRef));
  } catch (error) {
    console.error("Nova Poshta warehouse lookup failed:", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
