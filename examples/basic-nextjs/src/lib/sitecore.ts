// src/lib/sitecore.ts
// Experience Edge client. Reads a page by path, and lists product pages
// dynamically (so new pages in Sitecore appear automatically — no hardcoding).

import scConfig from 'sitecore.config';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';

const edgeUrl = (scConfig.api.edge.edgeUrl ?? '').replace(/\/$/, '');
const graphQLEndpoint =
  `${edgeUrl}/v1/content/api/graphql/v1?sitecoreContextId=${scConfig.api.edge.contextId}`;

const client = new GraphQLRequestClient(graphQLEndpoint);

// The content-tree root of your demo pages, e.g.
// /sitecore/content/SitecoreAIDemo/content-twin-poc/Home
const SITE_ROOT = (process.env.CONTENT_TWIN_SITE_ROOT ?? '').replace(/\/$/, '');

function resolveItemPath(inputPath: string): string {
  if (inputPath.startsWith('/sitecore/content')) return inputPath;
  const rel = inputPath.startsWith('/') ? inputPath : `/${inputPath}`;
  return `${SITE_ROOT}${rel}`;
}

export interface RawSitecoreField {
  name: string;
  value: string;
}

export interface RawSitecoreItem {
  id: string;
  name: string;
  path: string;
  url?: { path?: string } | null;
  fields: RawSitecoreField[];
}

const ITEM_BY_PATH_QUERY = /* GraphQL */ `
  query GetPage($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      path
      url { path }
      fields { name value }
    }
  }
`;

export async function fetchPageByPath(
  path: string,
  language = 'en'
): Promise<RawSitecoreItem | null> {
  const fullPath = resolveItemPath(path);
  const data = (await client.request(ITEM_BY_PATH_QUERY, {
    path: fullPath,
    language,
  })) as { item: RawSitecoreItem | null };
  return data?.item ?? null;
}

// ---- dynamic product-page listing (replaces hardcoded PAGE_PATHS) ----------
export interface ProductPage {
  slug: string;
  path: string;  // friendly path, e.g. /products/home-loan
  title: string;
}

const PRODUCT_PAGES_QUERY = /* GraphQL */ `
  query ProductPages($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      children {
        results {
          name
          url { path }
          fields { name value }
        }
      }
    }
  }
`;

// Reads every page under {SITE_ROOT}/products directly from Experience Edge.
// Add a page in Sitecore -> it shows up here automatically, no code change.
export async function listProductPages(language = 'en'): Promise<ProductPage[]> {
  const parent = `${SITE_ROOT}/products`;
  const data = (await client.request(PRODUCT_PAGES_QUERY, {
    path: parent,
    language,
  })) as {
    item: {
      children: {
        results: Array<{
          name: string;
          url?: { path?: string } | null;
          fields: RawSitecoreField[];
        }>;
      };
    } | null;
  };

  const results = data?.item?.children?.results ?? [];
  return results.map((r) => {
    const title = r.fields?.find((f) => f.name === 'Title')?.value || r.name;
    return { slug: r.name, path: `/products/${r.name}`, title };
  });
}