import { Script } from '@ckb-lumos/base';
import { BI, Transaction, commons, config, helpers } from '@ckb-lumos/lumos';
// @ts-ignore
import { initConfig, connect, signMessage } from '@joyid/ckb';
// @ts-ignore
import CKBConnector from './base';
import * as omnilock from './lock/omnilock';
import store from '@/store/store';

export default class JoyIdConnector extends CKBConnector {
  public type: string = 'JoyID';
  public icon = '/images/joyid-icon.png';

  constructor() {
    super();

    initConfig({
      name: 'Philosopherstone',
      joyidAppURL: process.env.NODE_ENV === 'development' ? 'https://testnet.joyid.dev' : "https://app.joy.id/",
      // joyidAppURL: process.env.NODE_ENV === 'development' ? 'https://app.joy.id/' : "https://app.joy.id/",
    });
  }

  public getAnyoneCanPayLock(minimalCkb = 0, minimalUdt = 0): Script {
    const lock = this.getLockFromAddress();
    return omnilock.getAnyoneCanPayLock(lock, minimalCkb, minimalUdt);
  }

  public isOwned(targetLock: Script): boolean {
    const lock = this.getLockFromAddress();
    return omnilock.isOwned(lock, targetLock);
  }

  public getCurrentWalletAddress = () => {
    const state = store.getState();
    return state.wallet.wallet;
  };

  private setAddress(address: string | undefined) {
    if (!address) {
      return;
    }

    this.setData({
      address,
      walletType: 'JoyID',
      ethAddress: '0x',
    });
  }

  public async connect(): Promise<void> {
    const walletData = this.getData();
    if (walletData?.walletType === this.type.toLowerCase() && walletData?.address) {
      return;
    }
    const joyidWalletInfo = await connect();
    this.setAddress(joyidWalletInfo.address);
    this.isConnected = true;
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }
}
