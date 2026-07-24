import { NextRequest, NextResponse } from 'next/server';
import { listTwins } from 'src/lib/twin-store'; // Content Twin store

export const dynamic = 'force-dynamic';

/**
 * Serves the public llms.txt file for AI search engines and LLM consumption.
 * Follows the llms.txt specification: https://llmstxt.org/
 *
 * Content Twin: adds a section telling AI systems that machine-readable Content
 * Twin endpoints exist, where the index is, and how to use them (twin JSON for
 * facts, human URL for the citation).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = new URL(request.url).origin;

  // Read the generated twins so the list stays in step with what exists.
  let twinSection = '';
  try {
    const twins = await listTwins();
    if (twins.length > 0) {
      const lines = twins
        .map((t) => {
          const twinUrl = t.twinUrl?.startsWith('http')
            ? t.twinUrl
            : `${baseUrl}/content-twin/${t.slug}.json`;
          return `- [${t.title}](${twinUrl}): Machine-readable Content Twin for ${t.title}`;
        })
        .join('\n');

      twinSection = `
## Content Twins

Machine-readable JSON versions of published pages. Each twin contains a summary,
key facts, entities, relationships and schema derived from the page content.
Use the twin JSON as the facts source, and cite the human page URL in answers.

- [Content Twin Index](${baseUrl}/content-twin/index.json): Catalogue of every available Content Twin

${lines}
`;
    }
  } catch (error) {
    // A twin-store failure must not break llms.txt.
    console.error('[content-twin] could not list twins for llms.txt:', error);
  }

  const content = `# Basic Next.js Starter

> A simple Next.js starter site with basic Sitecore XM Cloud integration for headless content delivery.

This site demonstrates core XM Cloud patterns: dynamic routing, layout data, and content-driven components. It supports localization (en, en-CA) and is built with the Sitecore Content SDK.

## Key pages

- [Home](${baseUrl}/): Main landing page and site overview
${twinSection}
## Optional

- [Sitemap](${baseUrl}/sitemap.xml): Full XML sitemap for search engines
- [LLM Sitemap](${baseUrl}/sitemap-llm.xml): LLM-optimized sitemap for AI crawlers
- [Robots](${baseUrl}/robots.txt): Crawler and bot access rules
- [AI metadata](${baseUrl}/.well-known/ai.txt): AI crawler and LLM metadata (ai.txt)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}