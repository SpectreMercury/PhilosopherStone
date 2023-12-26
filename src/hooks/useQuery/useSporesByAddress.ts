import { graphql } from '@/gql';
import { QuerySpore } from './type';
import { graphQLClient } from '@/utils/graphql';
import { useRefreshableQuery } from './useRefreshableQuery';
import { RequestDocument } from 'graphql-request';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSpores } from '@/store/sporeListSlice';

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
`)

export function useSporesByAddressQuery(address: string | undefined, enabled = true) {
  const dispatch = useDispatch()

  const { data, ...rest } = useRefreshableQuery(
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
  if (spores.length != 0) {
    dispatch(setSpores(spores))
  }
  return {
    ...rest,
    data: spores,
    isLoading,
  };
}