import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

/**
 * Hutko POSTs to response_url after payment (not a GET redirect).
 * This endpoint accepts that POST and redirects the user to the confirmation page.
 */
export async function POST(req: NextRequest) {
  // Read the POST body so Hutko doesn't get a parse error
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      await req.json();
    } else {
      await req.formData();
    }
  } catch {
    // ignore parse errors — we just need to consume the body
  }

  // Redirect the browser to the confirmation page
  return NextResponse.redirect(`${SITE_URL}/confirmation`, { status: 303 });
}

// Also handle GET in case Hutko ever switches to a redirect
export async function GET() {
  return NextResponse.redirect(`${SITE_URL}/confirmation`, { status: 303 });
}
