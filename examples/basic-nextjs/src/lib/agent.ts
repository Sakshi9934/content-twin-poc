// src/lib/agent.ts
// Agent retrieval + grounded answering. Picks the best-matching twin for a
// question, then asks Claude to answer using ONLY that twin's JSON.

import { listTwins, getTwin } from './twin-store';
import type { ContentTwin } from './twin-contract';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const NO_MATCH = 'I could not find relevant content in the Content Twin index.';

export interface AgentAnswer {
  answer: string;
  sourceUrl: string | null;
  usedTwin: string | null;
  confidence: 'High' | 'Medium' | 'Low' | 'None';
}

// Score each twin against the question: +3 per entity match, +2 per topic match,
// +1 per title-word match. Returns the highest-scoring twin, or null if none match.
async function selectBestTwin(question: string): Promise<{ twin: ContentTwin; slug: string } | null> {
  const q = question.toLowerCase();
  const list = await listTwins();

  let best: { twin: ContentTwin; slug: string; score: number } | null = null;

  for (const entry of list) {
    const twin = await getTwin(entry.slug);
    if (!twin) continue;

    let score = 0;
    for (const e of twin.entities ?? []) if (e && q.includes(e.toLowerCase())) score += 3;
    for (const t of twin.topics ?? []) if (t && q.includes(t.toLowerCase())) score += 2;
    for (const w of (twin.title ?? '').toLowerCase().split(/\s+/)) {
      if (w.length > 2 && q.includes(w)) score += 1;
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { twin, slug: entry.slug, score };
    }
  }
  return best ? { twin: best.twin, slug: best.slug } : null;
}

// Ask Claude to answer using ONLY the supplied twin (the grounding rule).
async function groundedAnswer(question: string, twin: ContentTwin): Promise<{ answer: string; confidence: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

  const system =
    'You are a controlled Content Twin agent. Answer only using the provided ' +
    'Content Twin JSON. Do not use outside knowledge. If the answer is not ' +
    'available in the Content Twin, say: The current Content Twin does not ' +
    'contain enough information to answer this. Return valid JSON only.';

  const user =
    `Question: ${question}\n\n` +
    `Content Twin JSON:\n${JSON.stringify(twin)}\n\n` +
    `Return JSON only: { "answer": "...", "confidence": "High | Medium | Low" }`;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify({ model, max_tokens: 600, temperature: 0.1, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`AI request failed: HTTP ${res.status} ${await res.text()}`);

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = data.content?.find((b) => b.type === 'text')?.text ?? '';

  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  let parsed: { answer?: string; confidence?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{'), last = cleaned.lastIndexOf('}');
    parsed = first !== -1 && last > first ? JSON.parse(cleaned.slice(first, last + 1)) : { answer: cleaned };
  }
  return { answer: parsed.answer ?? cleaned, confidence: parsed.confidence ?? 'Medium' };
}

export async function askAgent(question: string): Promise<AgentAnswer> {
  const selected = await selectBestTwin(question);

  // No matching twin -> the guardrail fallback, no AI call.
  if (!selected) {
    return { answer: NO_MATCH, sourceUrl: null, usedTwin: null, confidence: 'None' };
  }

  const { twin, slug } = selected;
  const { answer, confidence } = await groundedAnswer(question, twin);
  const base = (process.env.CONTENT_TWIN_BASE_URL ?? '').replace(/\/$/, '');

  return {
    answer,
    sourceUrl: twin.humanUrl,
    usedTwin: base ? `${base}/content-twin/${slug}.json` : `/content-twin/${slug}.json`,
    confidence: (confidence as AgentAnswer['confidence']) ?? 'Medium',
  };
}