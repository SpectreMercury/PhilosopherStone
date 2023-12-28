import { graphql } from '@/gql';
import { QuerySpore } from './type';
import { graphQLClient } from '@/utils/graphql';
import { useRefreshableQuery } from './useRefreshableQuery';

const sporeQueryDocument = graphql(`
  query GetSporeQuery($id: String!) {
    spore(id: $id) {
      id
      contentType
      capacityMargin
      clusterId
      cluster {
        id
        name
        description
      }
      cell {
        cellOutput {
          capacity
          lock {
            args
            codeHash
            hashType
          }
        }
        outPoint {
          txHash
          index
        }
      }
    }
  }
`);

export function useSporeQuery(id: string | undefined, enabled = true) {
  const { data, ...rest } = useRefreshableQuery(
    {
      queryKey: ['spore', id],
      queryFn: async (ctx) => {
        return graphQLClient.request(sporeQueryDocument, { id: id! }, ctx.meta?.headers as Headers);
      },
      enabled: !!id && enabled,
    },
    true,
  );
  const spore = data?.spore as QuerySpore | undefined;
  const isLoading = rest.isLoading || rest.isPending;

  return {
    ...rest,
    data: spore,
    isLoading,
  };
}
