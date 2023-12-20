import { GraphQLClient } from 'graphql-request';
import { GraphQLRequestContext } from '@apollo/server';

export const RESPONSE_CACHE_HEADER_NAME = 'X-Response-Cache';

export function getResponseCacheDisabledHeaders() {
  const headers = new Headers();
  headers.set(RESPONSE_CACHE_HEADER_NAME, 'false');
  return headers;
}

export function isResponseCacheEnabled(requestContext: GraphQLRequestContext<Record<string, any>>) {
  return requestContext.request.http?.headers.get(RESPONSE_CACHE_HEADER_NAME) !== 'false';
}

export const graphQLClient = new GraphQLClient('/api/graphql', {
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    return fetch(input, {
      ...init,
      next: {
        revalidate: false,
      },
    });
  },
});
