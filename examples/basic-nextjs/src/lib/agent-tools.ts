// src/lib/agent-tools.ts
// A TRUE agent. Claude decides the flow itself:
//   useTwin = true  -> gets all four tools: prefer twins, may fall back to pages
//   useTwin = false -> gets page tools ONLY, so twins are unreachable (enforced)

import { listTwins, getTwin } from './twin-store';
import { fetchPageByPath, listProductPages } from './sitecore';
import { normalizePage } from './normalize-page';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_STEPS = 8;

export interface AgenticUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  durationMs: number;
  calls: number; // AI calls made across the tool loop
}

export interface AgenticAnswer {
  answer: string;
  source: 'twin' | 'page' | 'both' | 'none';
  toolsUsed: string[];
  usage: AgenticUsage;
}

// ---- tool definitions ----
// Twin tools are only handed to Claude when useTwin is true. When useTwin is
// false, Claude physically cannot reach the twins — the flag is enforced, not
// merely suggested.
const TWIN_TOOLS = [
  {
    name: 'list_twins',
    description:
      'List the available Content Twins (slug, title, topics, entities). Use this to see whether a ' +
      'twin actually covers the subject of the question. An incidental mention of a term inside an ' +
      'unrelated product does NOT mean that twin covers it.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_twin',
    description:
      'Read one Content Twin in full by slug (facts, entities, relationships, schema). ' +
      'Only call this for a twin that genuinely covers the question.',
    input_schema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'twin slug, e.g. home-loan' } },
      required: ['slug'],
    },
  },
];

const PAGE_TOOLS = [
  {
    name: 'list_pages',
    description:
      'List the available human pages (slug, path, title). Use this when no Content Twin covers ' +
      'the question, to find a page that does.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_page',
    description:
      'Read a live human page by path, e.g. /products/home-loan. Use as the fallback when no twin covers the question.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'page path, e.g. /products/home-loan' } },
      required: ['path'],
    },
  },
];

function systemPrompt(preferTwin: boolean): string {
  const order = preferTwin
    ? 'FIRST call list_twins. If a twin genuinely covers the subject of the question, call get_twin and answer from it. ' +
      'If NO twin covers the subject, call list_pages and then get_page, and answer from the live page instead.'
    : 'Content Twins are NOT available for this request. Use the live pages only: call list_pages, then ' +
      'get_page on the most relevant page, and answer from that page.';

  return (
    'You are a Content Twin agent. Answer using ONLY information you retrieve through the tools. ' +
    'Never use outside knowledge and never invent facts.\n\n' +
    order +
    '\n\nIMPORTANT: a twin only "covers" a question if the twin is genuinely about that subject. ' +
    'If the question asks about product X and the only twins are about products Y and Z — even if ' +
    'Y happens to mention X in passing — that is NOT coverage. Fall back to the pages instead.\n\n' +
    'Begin your answer by stating whether you answered from a Content Twin or from the live page. ' +
    'If neither the twins nor the pages contain the answer, say you could not find relevant content.\n\n' +
    'Do NOT include any URLs, links or a "Sources" section in the answer — the source is returned ' +
    'separately by the system.'+
    '\n\nOUTPUT FORMAT:\n' +
'Write in plain text only. ' +
'Use normal sentences and paragraphs. ' +
'Do not use Markdown headings, bullet points, numbered lists, bold text, italics, tables, or code blocks. ' +
'Return only the answer text.'
  );
}


// The source URL is returned separately (see `source` / the tool trace), so any
// URLs or "Sources" citations the model writes into the answer are stripped here.
// Markdown and line breaks are left intact for the front end to format.
export function stripSourceUrls(raw: string): string {
  const original = (raw ?? '').trim();
  let out = original;

  // Markdown links -> keep the label, drop the URL.
  out = out.replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, '$1');
  // Parenthesised URLs, then any remaining bare URLs.
  out = out.replace(/\(\s*https?:\/\/[^)]+\)/g, '');
  out = out.replace(/https?:\/\/\S+/g, '');
  // Any line that is a "Source:" / "Sources:" / "Reference:" citation.
  out = out.replace(/^[ \t]*[-•*]?[ \t]*\**\s*(?:sources?|references?)\s*\**\s*:?[ \t]*[^\n]*$/gim, '');
  // Tidy the gaps left behind.
  out = out.replace(/[ \t]+$/gm, '');
  out = out.replace(/^[ \t]*[-•*][ \t]*$/gm, '');
  out = out.replace(/\n{3,}/g, '\n\n').trim();

  return out.length > 0 ? out : original;
}

async function executeTool(name: string, input: Record<string, unknown>, useTwin: boolean): Promise<string> {
  // Hard guard: never serve twin data when the caller asked for pages only.
  if (!useTwin && (name === 'list_twins' || name === 'get_twin')) {
    return 'Content Twins are not available for this request. Use list_pages and get_page instead.';
  }
  if (name === 'list_twins') {
    const list = await listTwins();
    if (list.length === 0) return 'No Content Twins exist yet.';
    const enriched = [];
    for (const e of list) {
      const t = await getTwin(e.slug);
      enriched.push({ slug: e.slug, title: e.title, humanUrl: e.humanUrl, topics: t?.topics ?? [], entities: t?.entities ?? [] });
    }
    return JSON.stringify(enriched);
  }
  if (name === 'get_twin') {
    const t = await getTwin(String(input.slug));
    return t ? JSON.stringify(t) : `No twin exists for slug: ${input.slug}`;
  }
  if (name === 'list_pages') {
    const pages = await listProductPages();
    return pages.length ? JSON.stringify(pages) : 'No pages found.';
  }
  if (name === 'get_page') {
    const item = await fetchPageByPath(String(input.path));
    if (!item) return `No page found at path: ${input.path}`;
    const p = normalizePage(item, String(input.path));
    return JSON.stringify({ title: p.title, summary: p.summary, content: p.content, url: p.canonicalUrl });
  }
  return `Unknown tool: ${name}`;
}

interface ToolUseBlock { type: 'tool_use'; id: string; name: string; input: Record<string, unknown>; }
interface TextBlock { type: 'text'; text: string; }
type Block = ToolUseBlock | TextBlock;

// Work out what the agent actually read, from its own tool trace.
function deriveSource(toolsUsed: string[]): AgenticAnswer['source'] {
  const readTwin = toolsUsed.some((t) => t.startsWith('get_twin'));
  const readPage = toolsUsed.some((t) => t.startsWith('get_page'));
  if (readTwin && readPage) return 'both';
  if (readTwin) return 'twin';
  if (readPage) return 'page';
  return 'none';
}

export async function runAgenticAgent(question: string, useTwin: boolean): Promise<AgenticAnswer> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

  const messages: Array<{ role: string; content: unknown }> = [{ role: 'user', content: question }];
  const toolsUsed: string[] = [];
  const startedAt = Date.now();
  let inputTokens = 0, outputTokens = 0, calls = 0;

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: systemPrompt(useTwin),
        // useTwin=true  -> all four tools (prefer twins, may fall back to pages)
        // useTwin=false -> page tools ONLY, so twins are unreachable
        tools: useTwin ? [...TWIN_TOOLS, ...PAGE_TOOLS] : PAGE_TOOLS,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`AI request failed: HTTP ${res.status} ${await res.text()}`);

    const data = (await res.json()) as {
      content: Block[];
      stop_reason: string;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    calls += 1;
    inputTokens += data.usage?.input_tokens ?? 0;
    outputTokens += data.usage?.output_tokens ?? 0;
    messages.push({ role: 'assistant', content: data.content });

    if (data.stop_reason === 'tool_use') {
      const toolResults = [];
      for (const block of data.content) {
        if (block.type === 'tool_use') {
          toolsUsed.push(`${block.name}(${JSON.stringify(block.input)})`);
          const result = await executeTool(block.name, block.input, useTwin);
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
        }
      }
      messages.push({ role: 'user', content: toolResults });
      continue;
    }

    const answer = stripSourceUrls(
      data.content.filter((b): b is TextBlock => b.type === 'text').map((b) => b.text).join('\n')
    );
    const usage: AgenticUsage = { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens, durationMs: Date.now() - startedAt, calls };
    return { answer, source: deriveSource(toolsUsed), toolsUsed, usage };
  }

  const usage: AgenticUsage = { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens, durationMs: Date.now() - startedAt, calls };
  return { answer: 'The agent could not complete the request within the step limit.', source: deriveSource(toolsUsed), toolsUsed, usage };
}