import { graphql } from '@/gql';
import { QuerySpore } from './type';
import { graphQLClient } from '@/utils/graphql';
import { useRefreshableQuery } from './useRefreshableQuery';
import { RequestDocument } from 'graphql-request';

const sporesByAddressQueryDocument = graphql(`
  query GetSporesByAddress($address: String!) {
    spores(filter: { addresses: [$address] }) {
      id
      contentType
      capacityMargin

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
`) as RequestDocument;

export function useSporesByAddressQuery(address: string | undefined, enabled = true) {

  const { data, ...rest } = useRefreshableQuery<{ spores: QuerySpore[] }>(
    {
      queryKey: ['sporesByAddress', address],
      queryFn: async (ctx) => {
        return graphQLClient.request(
          sporesByAddressQueryDocument,
          { address: address! },
          ctx.meta?.headers as Headers,
        );
      },
      enabled: !!address && enabled,
    },
    true,
  );

  const spores: QuerySpore[] = data?.spores ?? [];
  const isLoading = rest.isLoading || rest.isPending;

  return {
    ...rest,
    data: spores,
    isLoading,
  };
}
