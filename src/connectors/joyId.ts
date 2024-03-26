import { Script } from '@ckb-lumos/base';
import { BI, Transaction, commons, config, helpers } from '@ckb-lumos/lumos';
// @ts-ignore
import { initConfig, connect, signMessage } from '@joyid/ckb';
// @ts-ignore
import CKBConnector from './base';
import * as omnilock from './lock/omnilock';
import { isSameScript } from '@/utils/script';
import { bytes } from '@ckb-lumos/codec';
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
    if (!address) return
    this.setData({
      address,
      walletType: 'JoyID',
      ethAddress: '0x'
    })
  }

  public async connect(): Promise<void> {
    const walletData = this.getData();
    if (walletData?.walletType === this.type.toLowerCase() && walletData?.address) {
      return;
    }
    const JoyIdData = await connect();
    this.setAddress(JoyIdData.address);
    this.isConnected = true;
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async signTransaction(
    txSkeleton: helpers.TransactionSkeletonType,
  ): Promise<Transaction> {
    const { ethAddress } = this.getCurrentWalletAddress()!;

    const outputs = txSkeleton.get('outputs')!;
    outputs.forEach((output, index) => {
      const { lock, type } = output.cellOutput;

      if (!type && isSameScript(lock, this.lock)) {
        txSkeleton = txSkeleton.update('outputs', (outputs) => {
          output.cellOutput.capacity = BI.from(output.cellOutput.capacity)
            .sub(1000)
            .toHexString();
          return outputs.set(index, output);
        });
      }
    });

    const transaction = await omnilock.signTransaction(
      txSkeleton,
      this.lock!,
      async (message) => {
        return new Promise((resolve, reject) => {
          const button = document.createElement('button');
          button.onclick = async () => {
            try {
              const signature = await signMessage(bytes.bytify(message), ethAddress);
              resolve(signature);
            } catch (e) {
              reject(e);
            }
          };
          button.click();
        })
      },
    );
    return transaction;
  }
}
