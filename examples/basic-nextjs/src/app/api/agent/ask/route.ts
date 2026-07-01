// src/app/api/agent/ask/route.ts
// POST /api/agent/ask  { "question": "..." }
// Returns { answer, sourceUrl, usedTwin, confidence } grounded in one twin.

import { NextRequest, NextResponse } from 'next/server';
import { askAgent } from '../../../../lib/agent';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const question = (body.question ?? '').trim();
  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  try {
    const result = await askAgent(question);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: 'Agent failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}