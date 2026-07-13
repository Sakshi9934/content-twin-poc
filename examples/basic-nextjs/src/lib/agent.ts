// src/lib/agent.ts
// Agent retrieval + grounded answering with a fallback chain:
//   useTwin = false                      -> answer from the live human pages
//   useTwin = true, twin matches         -> answer from the twin JSON
//   useTwin = true, no matching twin     -> fall back to the live pages (+ notice)
//   useTwin = true, NO twins exist at all -> fall back to the live pages (+ notice)

import { listTwins, getTwin } from './twin-store';
import { fetchPageByPath, listProductPages } from './sitecore';
import { normalizePage } from './normalize-page';
import type { ContentTwin } from './twin-contract';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const NO_MATCH = 'I could not find relevant content to answer this.';

export interface AgentAnswer {
  answer: string;
  source: 'twin' | 'page' | 'none';
  sourceUrl: string | null;
  usedTwin: string | null;
  confidence: string;
  notice?: string; // set when the answer fell back from a twin to the live page
}

function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
    if (a !== -1 && b > a) return JSON.parse(cleaned.slice(a, b + 1));
    return { answer: cleaned };
  }
}

async function callClaude(system: string, user: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify({ model, max_tokens: 700, temperature: 0.1, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`AI request failed: HTTP ${res.status} ${await res.text()}`);

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
  return extractJson(text);
}

// ---------- TWIN PATH ----------
async function selectBestTwin(question: string) {
  const q = question.toLowerCase();
  const list = await listTwins();
  let best: { twin: ContentTwin; slug: string; score: number } | null = null;
  for (const entry of list) {
    const twin = await getTwin(entry.slug);
    if (!twin) continue;
    let score = 0;
    for (const e of twin.entities ?? []) if (e && q.includes(e.toLowerCase())) score += 3;
    for (const t of twin.topics ?? []) if (t && q.includes(t.toLowerCase())) score += 2;
    for (const w of (twin.title ?? '').toLowerCase().split(/\s+/)) if (w.length > 2 && q.includes(w)) score += 1;
    if (score > 0 && (!best || score > best.score)) best = { twin, slug: entry.slug, score };
  }
  return best;
}

async function answerFromTwin(question: string, twin: ContentTwin, slug: string): Promise<AgentAnswer> {
  const system =
    'You are a controlled content agent. Answer only using the provided Content Twin JSON. ' +
    'Do not use outside knowledge. If the answer is not present, say so. Return valid JSON only.';
  const user =
    `Question: ${question}\n\nContent Twin JSON:\n${JSON.stringify(twin)}\n\n` +
    `Return JSON only: { "answer": "...", "confidence": "High | Medium | Low" }`;

  const out = await callClaude(system, user);
  const base = (process.env.CONTENT_TWIN_BASE_URL ?? '').replace(/\/$/, '');
  return {
    answer: (out.answer as string) ?? '',
    source: 'twin',
    sourceUrl: twin.humanUrl,
    usedTwin: base ? `${base}/content-twin/${slug}.json` : `/content-twin/${slug}.json`,
    confidence: (out.confidence as string) ?? 'Medium',
  };
}

// ---------- HUMAN-PAGE PATH ----------
async function askFromPage(question: string): Promise<AgentAnswer> {
  const productPages = await listProductPages();
  const pages = [];
  for (const pp of productPages) {
    const item = await fetchPageByPath(pp.path);
    if (item) pages.push(normalizePage(item, pp.path));
  }
  if (pages.length === 0) {
    return { answer: NO_MATCH, source: 'none', sourceUrl: null, usedTwin: null, confidence: 'None' };
  }

  const content = pages
    .map((p) => `URL: ${p.canonicalUrl}\nTitle: ${p.title}\nSummary: ${p.summary}\nContent: ${p.content}`)
    .join('\n\n---\n\n');

  const system =
    'You are a controlled content agent. Answer only using the provided pages. ' +
    'Do not use outside knowledge. Pick the single most relevant page and answer from it. ' +
    'If no page contains the answer, set sourceUrl to null. Return valid JSON only.';
  const user =
    `Question: ${question}\n\nPages:\n${content}\n\n` +
    `Return JSON only: { "answer": "...", "sourceUrl": "<the URL of the page you used, or null>", "confidence": "High | Medium | Low" }`;

  const out = await callClaude(system, user);
  const sourceUrl = (out.sourceUrl as string) || null;

  if (!sourceUrl) {
    return { answer: (out.answer as string) ?? NO_MATCH, source: 'none', sourceUrl: null, usedTwin: null, confidence: 'None' };
  }
  return {
    answer: (out.answer as string) ?? '',
    source: 'page',
    sourceUrl,
    usedTwin: null,
    confidence: (out.confidence as string) ?? 'Medium',
  };
}

export async function askAgent(question: string, useTwin: boolean): Promise<AgentAnswer> {
  // Explicit page mode — no twins involved, no notice.
  if (!useTwin) {
    return askFromPage(question);
  }

  const twins = await listTwins();

  // Case: no twins exist at all (empty store).
  if (twins.length === 0) {
    const page = await askFromPage(question);
    return { ...page, notice: 'No Content Twins are available yet — showing details from the live page.' };
  }

  // Case: a twin matches -> answer from it.
  const best = await selectBestTwin(question);
  if (best) {
    return answerFromTwin(question, best.twin, best.slug);
  }

  // Case: twins exist but none matched this question -> fall back to the live page.
  const page = await askFromPage(question);
  return { ...page, notice: 'No Content Twin matched this question — showing details from the live page.' };
}