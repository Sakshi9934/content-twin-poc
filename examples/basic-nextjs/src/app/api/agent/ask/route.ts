// src/app/api/agent/ask/route.ts
// POST /api/agent/ask  { "question": "...", "useTwin": true }
// useTwin defaults to true. false -> answer from the live human page instead.

import { NextRequest, NextResponse } from 'next/server';
import { askAgent } from '../../../../lib/agent';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { question?: string; useTwin?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const question = (body.question ?? '').trim();
  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const useTwin = body.useTwin !== false; // default true

  try {
    const result = await askAgent(question, useTwin);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: 'Agent failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}