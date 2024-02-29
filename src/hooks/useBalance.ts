import { trpc } from '@/app/_trpc/client';
import BigNumber from 'bignumber.js';

const useWalletBalance = (walletAddress: string) => {
  const { data: capacity = 0 } = trpc.account.balance.useQuery(
    { address: walletAddress },
    { enabled: !!walletAddress }
  );

  const balance = new BigNumber(capacity).toNumber() / 10 ** 8;

  return balance;
};

export default useWalletBalance;
