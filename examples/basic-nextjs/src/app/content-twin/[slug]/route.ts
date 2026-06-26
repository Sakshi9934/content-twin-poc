// src/app/content-twin/[slug]/route.ts
// GET /content-twin/[slug].json  ->  the stored Content Twin as public JSON.
// No auth (public, published content only). The URL carries a .json suffix, so
// the [slug] param arrives as e.g. "home-loan.json" — we strip it before lookup.

import { NextResponse } from 'next/server';
import { getTwin } from '../../../lib/twin-store';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params; // Next.js 15+/16: params is async
  const slug = rawSlug.replace(/\.json$/i, '');

  const twin = await getTwin(slug);

  if (!twin) {
    return NextResponse.json(
      { error: 'Content Twin not found' },
      { status: 404 }
    );
  }

  // The stored twin contains only published-derived content and source metadata —
  // no secrets or draft content — so it is safe to serve publicly.
  return NextResponse.json(twin, {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}