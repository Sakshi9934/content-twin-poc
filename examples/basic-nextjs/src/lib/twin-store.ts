// src/lib/twin-store.ts
// File-based persistence for the POC. Each twin is one JSON file under
// /data/content-twins/{slug}.json. Swap for KV/Supabase/Mongo after the demo.

import { promises as fs } from 'fs';
import path from 'path';
import type { ContentTwin } from './twin-contract';

// Server-side writable location, resolved from the project root.
const STORE_DIR = path.join(process.cwd(), 'data', 'content-twins');

const BASE_URL = (process.env.CONTENT_TWIN_BASE_URL ?? '').replace(/\/$/, '');

function filePathFor(slug: string): string {
  return path.join(STORE_DIR, `${slug}.json`);
}

function twinUrlFor(slug: string): string {
  return BASE_URL ? `${BASE_URL}/content-twin/${slug}.json` : `/content-twin/${slug}.json`;
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

// Lightweight entry used by the sitemap, llms.txt, and the twin index.
export interface TwinIndexEntry {
  slug: string;
  title: string;
  twinUrl: string;
  humanUrl: string;
}

export async function saveTwin(slug: string, twin: ContentTwin): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePathFor(slug), JSON.stringify(twin, null, 2), 'utf-8');
}

export async function getTwin(slug: string): Promise<ContentTwin | null> {
  try {
    const raw = await fs.readFile(filePathFor(slug), 'utf-8');
    return JSON.parse(raw) as ContentTwin;
  } catch {
    // Missing file (ENOENT) or unreadable -> treat as "no twin yet".
    return null;
  }
}

export async function existsTwin(slug: string): Promise<boolean> {
  try {
    await fs.access(filePathFor(slug));
    return true;
  } catch {
    return false;
  }
}

export async function listTwins(): Promise<TwinIndexEntry[]> {
  try {
    await ensureDir();
    const files = await fs.readdir(STORE_DIR);
    const slugs = files.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));

    const entries: TwinIndexEntry[] = [];
    for (const slug of slugs) {
      const twin = await getTwin(slug);
      if (twin) {
        entries.push({
          slug,
          title: twin.title,
          twinUrl: twinUrlFor(slug),
          humanUrl: twin.humanUrl,
        });
      }
    }
    return entries;
  } catch {
    return [];
  }
}