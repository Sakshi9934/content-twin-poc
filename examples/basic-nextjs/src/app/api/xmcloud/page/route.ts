// src/app/api/xmcloud/page/route.ts
// GET /api/xmcloud/page?path=/products/home-loan
// Returns normalized, machine-friendly JSON for a single PUBLISHED page.

import { NextRequest, NextResponse } from "next/server";
import { fetchPageByPath } from "lib/sitecore";
import { normalizePage } from "lib/normalize-page";

// Always reflect the latest published content during the POC.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");

  // 1. Input validation -> 400 if path is missing
  if (!path) {
    return NextResponse.json(
      { error: "Missing required query parameter: path" },
      { status: 400 }
    );
  }

  try {
    // 2. Fetch the published item from Experience Edge
    const item = await fetchPageByPath(path);

    // 5. Not found -> 404 with a message
    if (!item) {
      return NextResponse.json(
        { error: `No published item found at path: ${path}` },
        { status: 404 }
      );
    }

    // 3 + 4. Normalize Sitecore field names and strip rich-text markup
    const normalized = normalizePage(item, path);

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to fetch page from Experience Edge",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}