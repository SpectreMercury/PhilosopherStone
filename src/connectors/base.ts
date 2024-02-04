import { setWallet, clearWallet, WalletInfo } from '@/store/walletSlice';
import { Script, Transaction, config, helpers } from '@ckb-lumos/lumos';
import store from '@/store/store';
import { sporeConfig } from '@/utils/config';

export default abstract class CKBConnector {
  private _isConnected: boolean = false;
  private _enable: boolean = true;
  protected store = store;
  abstract type: string;
  abstract icon: string;

  protected set isConnected(val: boolean) {
    this._isConnected = val;
  }

  public get isConnected() {
    return this._isConnected;
  }

  protected set enable(val: boolean) {
    this._enable = val;
  }

  public get enable() {
    return this._enable;
  }

  public get lock(): Script | undefined {
    const walletData = this.getCurrentWalletAddress();
    if(!walletData) return undefined
    const { address } = walletData;
    if (!address) {
      return undefined;
    }
    return helpers.parseAddress(address, {
      config: sporeConfig.lumos
    });
  }

  public getCurrentWalletAddress = () => {
    const state = store.getState();
    return state.wallet.wallet;
  };

  protected setData(data: WalletInfo) {
    this.store.dispatch(setWallet(data));
  }


  protected getData(): WalletInfo | null {
    const walletData = this.getCurrentWalletAddress();
    return walletData
  }


  protected getLockFromAddress(): Script {
    const walletData = this.getCurrentWalletAddress();
    const { address } = walletData!!;
    return helpers.parseAddress(address, {
      config: sporeConfig.lumos,
    });
  }

  abstract connect(): Promise<void>;
  abstract getAnyoneCanPayLock(): Script;
  abstract isOwned(targetLock: Script): boolean;
  abstract disconnect(): Promise<void> | void;
  abstract signTransaction(
    txSkeleton: helpers.TransactionSkeletonType,
  ): Promise<Transaction>;
}
