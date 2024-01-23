import CKBConnector from '@/connectors/base';
import SporeService from '@/spore';
import { RootState } from '@/store/store';
import { WalletInfo } from '@/store/walletSlice';
import { Script, Transaction, config, helpers } from '@ckb-lumos/lumos';
import { enqueueSnackbar } from 'notistack';
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

  
  const getCells = async () => {
    let cells = await SporeService.shared.getNewOmnilock()
    console.log(cells[0])
    return cells[0]
  }

  const lock = useMemo(() => {
    if (!address) return undefined;
    return helpers.parseAddress(address, { config: config.predefined.AGGRON4 });
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
  
  const disconnect = useCallback(() => {
    if (!connector) {
      throw new Error(`Connector ${connectorType} not found`);
    }
    connector.disconnect();
  }, [connector, connectorType]);

  const connect = useCallback(() => {
    if (connectors.length === 0) {
      throw new Error('No connector found');
    }
    if (connectors.length === 1) {
      try {
        const [connector] = connectors;
        connector.connect();
        return;
      } catch (e) {
        enqueueSnackbar((e as Error).message, {variant: 'error'})
      }
    }
    return connectors
  }, [connectors])

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
    connect,
    isOwned,
    disconnect,
    getAnyoneCanPayLock,
    signTransaction,
  };
};
