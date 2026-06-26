// src/lib/ai.ts
// Turns a normalized XM Cloud page into a GeneratedTwin using the Anthropic
// Messages API. Builds the prompt, calls Claude, parses the JSON, and validates
// the shape. It does NOT store anything and does NOT add score/source/urls —
// that is the Generate API's job.

import type { NormalizedPage } from './normalize-page';
import { type GeneratedTwin, validateGeneratedTwin } from './twin-contract';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const SYSTEM_PROMPT =
  'You are a content architecture assistant. Convert only the supplied XM Cloud ' +
  'page content into a machine-readable Content Twin. Do not invent facts. If ' +
  'information is missing, return it in missingFields. Return valid JSON only, ' +
  'with no markdown fences or commentary.';

const REQUIRED_KEYS = `Return a JSON object with exactly these keys and types:
- machineSummary: string (max 80 words)
- shortAnswer: string
- keyFacts: array of strings
- entities: array of strings (plain entity names only, e.g. "Home Loan")
- topics: array of strings
- relationships: array of objects, each { "subject": string, "predicate": string, "object": string } — all three values are plain strings
- schemaType: string
- schemaJson: a JSON-LD object
- recommendedQuestions: array of strings
- missingFields: array of strings`;

function buildUserPrompt(page: NormalizedPage): string {
  return [
    'Create a Content Twin for this XM Cloud page:',
    JSON.stringify(page, null, 2),
    '',
    `Required keys: ${REQUIRED_KEYS}`,
  ].join('\n');
}

// Pull a JSON object out of the model response, tolerating fences or stray text.
function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first !== -1 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error('no json found');
  }
}

export async function generateTwinFromPage(
  page: NormalizedPage
): Promise<GeneratedTwin> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in .env.local');
  }
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048, // required by the Anthropic API
      temperature: 0.2,
      system: SYSTEM_PROMPT, // top-level, not a message
      messages: [{ role: 'user', content: buildUserPrompt(page) }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`AI request failed: HTTP ${res.status} ${detail}`);
  }

  // Claude returns content as an array of blocks; the text is in a "text" block.
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((b) => b.type === 'text')?.text;
  if (!text) throw new Error('AI returned an empty response');

  let parsed: unknown;
  try {
    parsed = extractJson(text);
  } catch {
    throw new Error('AI response was not valid JSON');
  }

  // Reject malformed output before it can ever be scored or stored.
  const check = validateGeneratedTwin(parsed);
  if (!check.valid) {
    throw new Error(`AI output failed validation: ${check.errors.join('; ')}`);
  }

  return parsed as GeneratedTwin;
}