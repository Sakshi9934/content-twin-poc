import { createSitemapRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';
import { NextRequest, NextResponse } from 'next/server';
import { listTwins } from 'src/lib/twin-store'; // Content Twin store

export const dynamic = 'force-dynamic';

/**
 * API route for generating sitemap.xml
 *
 * This Next.js API route handler dynamically generates and serves the sitemap XML for your site.
 * The sitemap configuration can be managed within XM Cloud.
 *
 * Content Twin: after the SDK builds the sitemap, every generated Content Twin
 * JSON endpoint is appended as an additional <url> entry, so crawlers discover
 * both the human page and its machine-readable twin.
 */

const { GET: sitecoreGET } = createSitemapRouteHandler({
  client,
  sites,
});

/** XML-escape a URL before putting it in a <loc> element. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Injects the Content Twin URLs into an existing <urlset> sitemap.
 * Leaves the XML untouched if it is a sitemap index or is not recognised,
 * so a failure here can never break the SDK's sitemap.
 */
async function appendTwinUrls(xml: string, baseUrl: string): Promise<string> {
  // Only a <urlset> document has <url> entries to add to.
  if (!xml.includes('</urlset>')) return xml;

  const twins = await listTwins();
  if (twins.length === 0) return xml;

  const lastMod = new Date().toISOString();

  const entries = twins
    .map((t) => {
      // Prefer the absolute URL from the store; fall back to this request's origin.
      const loc = t.twinUrl?.startsWith('http')
        ? t.twinUrl
        : `${baseUrl}/content-twin/${t.slug}.json`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>`;
    })
    .join('\n');

  return xml.replace('</urlset>', `${entries}\n</urlset>`);
}

/**
 * Custom GET handler: serves the SDK sitemap, plus the Content Twin endpoints.
 */
export async function GET(request: NextRequest) {
  const response = await sitecoreGET(request);

  try {
    // Only enhance a successful XML response.
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok || !contentType.includes('xml')) return response;

    const xml = await response.clone().text();
    const baseUrl = new URL(request.url).origin;
    const enhanced = await appendTwinUrls(xml, baseUrl);

    return new NextResponse(enhanced, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    // Never let the twin lookup break the sitemap — return the SDK's version.
    console.error('[content-twin] could not append twin URLs to sitemap:', error);
    return response;
  }
}