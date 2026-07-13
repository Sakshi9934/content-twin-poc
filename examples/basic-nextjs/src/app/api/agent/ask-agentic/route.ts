// src/app/api/agent/ask-agentic/route.ts
// POST /api/agent/ask-agentic  { "question": "...", "useTwin": true }
// Tool-driven agent. useTwin (default true) chooses twin tools vs page tools.

import { NextRequest, NextResponse } from 'next/server';
import { runAgenticAgent } from '../../../../lib/agent-tools';

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
    const result = await runAgenticAgent(question, useTwin);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: 'Agent failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}