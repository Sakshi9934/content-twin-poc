// src/lib/normalize-page.ts
// Maps raw Sitecore fields (from the Content Twin Page template) into the
// stable JSON shape the rest of the twin pipeline depends on.

import type { RawSitecoreItem } from "./sitecore";

export interface NormalizedPage {
  id: string;
  path: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  productOrService: string;
  industry: string;
  audience: string;
  region: string;
  author: string;
  lastReviewedDate: string;
  canonicalUrl: string;
}

// Field display names EXACTLY as created on the Content Twin Page template.
// If you named a field differently in XM Cloud, change it here.
const FIELD = {
  title: "Title",
  summary: "Summary",
  content: "Main Content",
  productOrService: "Product Or Service",
  industry: "Industry",
  audience: "Audience",
  region: "Region",
  author: "Author",
  lastReviewedDate: "Last Reviewed Date",
} as const;

// Turn the fields array into a quick name -> value lookup.
function toFieldMap(item: RawSitecoreItem): Record<string, string> {
  const map: Record<string, string> = {};
  for (const f of item.fields ?? []) {
    map[f.name] = f.value ?? "";
  }
  return map;
}

// Strip scripts/markup from rich text but keep human-readable text.
// Good enough for the POC; swap for a real sanitizer (e.g. html-to-text)
// before production.
function stripRichText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Derive a slug from the content path, e.g. /products/home-loan -> home-loan
function slugFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

// Edge date values arrive as ISO 8601 ("2026-06-15T00:00:00Z").
// Reduce to a plain YYYY-MM-DD freshness signal when possible.
function normalizeDate(value: string): string {
  if (!value) return "";
  // Sitecore stores dates compactly: 20260620T000000Z
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toISOString().slice(0, 10);
}

export function normalizePage(
  item: RawSitecoreItem,
  requestedPath: string
): NormalizedPage {
  const f = toFieldMap(item);
  const slug = slugFromPath(item.path || requestedPath);
  const baseUrl = (process.env.CONTENT_TWIN_BASE_URL ?? "").replace(/\/$/, "");
  const humanPath = item.url?.path ?? requestedPath;

  return {
    id: item.id,
    path: item.path || requestedPath,
    slug,
    title: f[FIELD.title] || item.name || "",
    summary: f[FIELD.summary] ?? "",
    content: stripRichText(f[FIELD.content] ?? ""),
    productOrService: f[FIELD.productOrService] ?? "",
    industry: f[FIELD.industry] ?? "",
    audience: f[FIELD.audience] ?? "",
    region: f[FIELD.region] ?? "",
    author: f[FIELD.author] ?? "",
    lastReviewedDate: normalizeDate(f[FIELD.lastReviewedDate] ?? ""),
    canonicalUrl: baseUrl ? `${baseUrl}${humanPath}` : humanPath,
  };
}