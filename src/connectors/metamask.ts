import {
  connect,
  watchAccount,
  disconnect,
  signMessage,
  configureChains,
  mainnet,
  createConfig,
} from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import CKBConnector from './base';
import { setWallet, WalletInfo } from '@/store/walletSlice';
import {
  Script,
  Transaction,
  commons,
  config,
  helpers,
} from '@ckb-lumos/lumos';
import * as omnilock from './lock/omnilock';

export default class MetaMaskConnector extends CKBConnector {
  public type = 'MetaMask';
  public icon = '/images/metamask-icon.png';
  private listeners: Array<() => void> = [];
  public config: any;

  constructor() {
    super();
    const { publicClient, webSocketPublicClient } = configureChains(
      [mainnet],
      [publicProvider()],
    );
    this.config = createConfig({
      autoConnect: true,
      publicClient,
      webSocketPublicClient,
    });
  }

  private setAddress(ethAddress: `0x${string}` | undefined) {
    if (!ethAddress) {
      return;
    }
    config.initializeConfig(config.predefined.AGGRON4);
    const lock = commons.omnilock.createOmnilockScript({
      auth: { flag: 'ETHEREUM', content: ethAddress ?? '0x' },
    });
    const address = helpers.encodeToAddress(lock, {
      config: config.predefined.AGGRON4,
    });
    this.store.dispatch(setWallet({
      address,
      walletType: 'MetaMask',
      ethAddress: ethAddress,
    }));
  }

  public async connect() {
    const { account } = await connect({ connector: new InjectedConnector() });
    this.setAddress(account);
    this.isConnected = true;
    this.listeners.push(
      watchAccount((account) => {
        if (account.isConnected) {
          this.setAddress(account.address);
        }
        if (account.isDisconnected) {
          this.setAddress(undefined);
        }
      }),
    );
  }

  public async disconnect(): Promise<void> {
    await disconnect();
    this.listeners.forEach((unlisten) => unlisten());
    this.isConnected = false;
  }

  public getAnyoneCanPayLock(minimalCkb = 0, minimalUdt = 0): Script {
    const lock = this.getLockFromAddress();
    return omnilock.getAnyoneCanPayLock(lock, minimalCkb, minimalUdt);
  }

  public isOwned(targetLock: Script): boolean {
    const lock = this.getLockFromAddress();
    return omnilock.isOwned(lock, targetLock);
  }

  public async signTransaction(
    txSkeleton: helpers.TransactionSkeletonType,
  ): Promise<Transaction> {
    const transaction = await omnilock.signTransaction(
      txSkeleton,
      this.lock!,
      async (message) => {
        const signature = await signMessage({ message: { raw: message } as any })
        return signature;
      },
    );
    return transaction;
  }
}
