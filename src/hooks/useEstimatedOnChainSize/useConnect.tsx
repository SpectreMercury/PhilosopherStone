import CKBConnector from '@/connectors/base';
import { RootState } from '@/store/store';
import { WalletInfo } from '@/store/walletSlice';
import { sporeConfig } from '@/utils/config';
import { Script, Transaction, config, helpers } from '@ckb-lumos/lumos';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

export const ConnectContext = createContext<{
  autoConnect?: boolean;
  connectors: CKBConnector[];
}>({
  autoConnect: false,
  connectors: [],
});

export const ConnectProvider = ConnectContext.Provider;

export const useConnect = () => {
  const { connectors, autoConnect } = useContext(ConnectContext);
  const walletInfo = useSelector((state: RootState) => state.wallet.wallet);

  const address = walletInfo?.address
  const connectorType = walletInfo?.walletType
  const [autoConnected, setAuthConnected] = useState(false);
  const connected = !!address;

  const lock = useMemo(() => {
    if (!address) return undefined;
    return helpers.parseAddress(address, { config: sporeConfig.lumos });
  }, [address]);

  const connector = useMemo(
    () =>
      connectors.find(
        (connector) =>
          connector.type.toLowerCase() === connectorType?.toLowerCase(),
      ),
    [connectors, connectorType],
  );

  const isOwned = useCallback(
    (lock: Script) => {
      if (!connector) {
        return false;
      }
      return connector.isOwned(lock);
    },
    [connector],
  );

  const getAnyoneCanPayLock = useCallback(() => {
    if (!connector) {
      throw new Error(`Connector ${connectorType} not found`);
    }
    const lock = connector.getAnyoneCanPayLock();
    return lock;
  }, [connector, connectorType]);

  const signTransaction = useCallback(
    async (
      txSkeleton: helpers.TransactionSkeletonType,
    ): Promise<Transaction> => {
      if (!connector) {
        throw new Error(`Connector ${connectorType} not found`);
      }
      const transaction = await connector.signTransaction(txSkeleton);
      return transaction;
    },
    [connector, connectorType],
  );

  return {
    address,
    lock,
    isOwned,
    getAnyoneCanPayLock,
    signTransaction,
  };
};
