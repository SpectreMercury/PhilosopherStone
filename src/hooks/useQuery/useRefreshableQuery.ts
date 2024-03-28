import { getResponseCacheDisabledHeaders } from '@/utils/graphql';
import {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

export const RESPONSE_CACHE_ENABLED = process.env.NEXT_PUBLIC_RESPONSE_CACHE_ENABLED === 'true';

export function useRefreshableQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, refreshOnMount?: boolean) {
  const { queryKey, queryFn, enabled, initialData } = options;
  const queryClient = useQueryClient();

  type QueryContext = {
    queryKey: TQueryKey;
    signal: AbortSignal;
    meta: Record<string, unknown> | undefined;
  };

  const request = useCallback(
    (ctx: QueryContext, headers?: Headers) => {
      if (!ctx.meta) {
        ctx.meta = {};
      }
      if (headers) {
        ctx.meta.headers = headers;
      }
      if (typeof queryFn === 'function') {
        return Promise.resolve(queryFn(ctx));
      } else {
        return Promise.reject(new Error('queryFn is not a function'));
      }
    },
    [queryFn],
  );

  const queryResult = useQuery({
    queryKey,
    queryFn: async (ctx) => {
      const response = await request(ctx);
      if (RESPONSE_CACHE_ENABLED && refreshOnMount) {
        const headers = getResponseCacheDisabledHeaders();
        request(ctx, headers)
          .then((data) => {
            // @ts-ignore
            queryClient.setQueryData(queryKey, data);
          })
          .catch((e) => console.error(e));
      }
      return response;
    },
    enabled,
    initialData,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await request(
        {
          queryKey,
          signal: new AbortController().signal,
          meta: {},
        },
        getResponseCacheDisabledHeaders(),
      );
      // @ts-ignore
      queryClient.setQueryData(queryKey, data);
    } catch (error) {
      console.error(error);
    }
  }, [queryClient, queryKey, request]);

  return {
    ...queryResult,
    refresh,
  };
}
