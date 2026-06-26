// src/app/api/content-twin/generate/route.ts
// POST /api/content-twin/generate
// Header: x-content-twin-admin-key: {{CONTENT_TWIN_ADMIN_KEY}}
// Body:   { "path": "/products/home-loan", "forceRegenerate": true }
//
// Orchestrates the whole pipeline: fetch -> normalize -> AI -> score -> enrich -> save.

import { NextRequest, NextResponse } from 'next/server';
import { fetchPageByPath } from 'lib/sitecore';
import { normalizePage } from 'lib/normalize-page';
import { generateTwinFromPage } from 'lib/ai';
import { saveTwin, getTwin, existsTwin } from 'lib/twin-store';
import type { ContentTwin } from 'lib/twin-contract';
export const dynamic = 'force-dynamic';

function twinUrlFor(slug: string): string {
  const base = (process.env.CONTENT_TWIN_BASE_URL ?? '').replace(/\/$/, '');
  return base ? `${base}/content-twin/${slug}.json` : `/content-twin/${slug}.json`;
}

export async function POST(req: NextRequest) {
  // 1. Validate the admin key.
  const adminKey = process.env.CONTENT_TWIN_ADMIN_KEY;
  const provided = req.headers.get('x-content-twin-admin-key');
  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate body.path.
  let body: { path?: string; forceRegenerate?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const path = body.path;
  if (!path) {
    return NextResponse.json({ error: 'Missing required field: path' }, { status: 400 });
  }
  const forceRegenerate = body.forceRegenerate === true;

  try {
    // 3. Fetch + normalize the published page.
    const item = await fetchPageByPath(path);
    if (!item) {
      return NextResponse.json(
        { error: `No published item found at path: ${path}` },
        { status: 404 }
      );
    }
    const page = normalizePage(item, path);
    const slug = page.slug;

    // 4. If not forcing, return the existing twin.
    if (!forceRegenerate && (await existsTwin(slug))) {
      const existing = await getTwin(slug);
      if (existing) {
        return NextResponse.json({
          status: 'Exists',
          twinUrl: twinUrlFor(slug),
        //  twinScore: existing.twinScore,
          contentTwin: existing,
        });
      }
    }

    // 5 + 6. Generate the twin. ai.ts validates the AI output and throws if it is
    // invalid — so on failure we fall to the catch below and the old twin is
    // never overwritten (saveTwin runs only after a successful generation).
    const generated = await generateTwinFromPage(page);

    // 7. Score it against the Section 6 rules.
   // const { score } = calculateTwinScore(generated, page.lastReviewedDate);

    // 8. Add the system-owned fields the AI must never produce itself.
    const twin: ContentTwin = {
      ...generated,
      id: slug,
      title: page.title,
      humanUrl: page.canonicalUrl,
      //twinScore: score,
      source: { system: 'XM Cloud', path: page.path, itemId: page.id },
      lastGenerated: new Date().toISOString(),
      lastReviewedDate: page.lastReviewedDate,
    };

    // 9. Save to the store.
    await saveTwin(slug, twin);

    // 10. Return twinUrl, twinScore, and the twin.
    return NextResponse.json({
      status: 'Generated',
      twinUrl: twinUrlFor(slug),
      //twinScore: score,
      contentTwin: twin,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'Failed',
        error: 'Twin generation failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}