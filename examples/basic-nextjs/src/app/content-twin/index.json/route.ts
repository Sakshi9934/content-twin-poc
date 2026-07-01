// src/app/content-twin/index.json/route.ts
// GET /content-twin/index.json — the controlled index the agent starts from.
// A static "index.json" segment takes precedence over the [slug] route, so this
// is served instead of being treated as a twin lookup.

import { NextResponse } from 'next/server';
import { listTwins, getTwin } from '../../../lib/twin-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await listTwins();

  // Enrich each entry with topics + entities so the agent can score matches
  // without loading every full twin.
  const twins = [];
  for (const t of list) {
    const full = await getTwin(t.slug);
    twins.push({
      slug: t.slug,
      title: t.title,
      humanUrl: t.humanUrl,
      twinUrl: t.twinUrl,
      topics: full?.topics ?? [],
      entities: full?.entities ?? [],
    });
  }

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), twins },
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}