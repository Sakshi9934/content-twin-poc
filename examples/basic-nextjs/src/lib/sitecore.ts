// src/lib/sitecore.ts
// Uses your app's OWN Edge connection (from sitecore.config) and lets you pass
// a clean path like /products/home-loan, mapping it to the full content path.

import scConfig from 'sitecore.config';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';

const edgeUrl = (scConfig.api.edge.edgeUrl ?? '').replace(/\/$/, '');
const graphQLEndpoint =
  `${edgeUrl}/v1/content/api/graphql/v1?sitecoreContextId=${scConfig.api.edge.contextId}`;

const client = new GraphQLRequestClient(graphQLEndpoint);

// The content-tree location of your demo pages, set once in .env.local, e.g.
// CONTENT_TWIN_SITE_ROOT=/sitecore/content/SitecoreAIDemo/content-twin-poc/Home
const SITE_ROOT = (process.env.CONTENT_TWIN_SITE_ROOT ?? '').replace(/\/$/, '');

// Accept either a full content path or a clean route-style path.
function resolveItemPath(inputPath: string): string {
  if (inputPath.startsWith('/sitecore/content')) return inputPath; // already full
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
      url {
        path
      }
      fields {
        name
        value
      }
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