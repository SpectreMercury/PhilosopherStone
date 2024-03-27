import { sporeConfig } from '@/utils/config';
import {
  getAnyoneCanPayMinimumCapacity,
  isAnyoneCanPay,
  isSameScript,
} from '@/utils/script';
import { Script, Transaction, blockchain } from '@ckb-lumos/base';
import { bytes, number } from '@ckb-lumos/codec';
import { common } from '@ckb-lumos/common-scripts';
import { BI, commons, config, helpers } from '@ckb-lumos/lumos';

export function getAnyoneCanPayLock(
  sourceLock: Script,
  minimalCkb = 0,
  minimalUdt = 0,
): Script {
  const lock = Object.assign({}, sourceLock);
  const ckb = bytes.hexify(number.Uint8.pack(minimalCkb)).slice(2);
  const udt = bytes.hexify(number.Uint8.pack(minimalUdt)).slice(2);
  const args = `02${ckb}${udt}`;
  lock.args = lock.args.slice(0, 44) + args;
  return lock;
}

export function isOwned(sourceLock: Script, targetLock: Script): boolean {
  return (
    sourceLock.codeHash === targetLock.codeHash &&
    sourceLock.hashType === targetLock.hashType &&
    // same omnilock auth args
    // https://blog.cryptape.com/omnilock-a-universal-lock-that-powers-interoperability-1#heading-authentication
    sourceLock.args.slice(0, 44) === targetLock.args.slice(0, 44)
  );
}

export async function signTransaction(
  txSkeleton: helpers.TransactionSkeletonType,
  fromLock: Script,
  signMessage: (message: string) => Promise<string>,
): Promise<Transaction> {
  const inputs = txSkeleton.get('inputs')!;
  const outputs = txSkeleton.get('outputs')!;

  // add anyone-can-pay minimal capacity in outputs
  // https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0042-omnilock/0042-omnilock.md#anyone-can-pay-mode
  outputs.forEach((output, index) => {
    const { lock } = output.cellOutput;
    if (
      isAnyoneCanPay(lock) &&
      inputs.some((i) => isSameScript(i.cellOutput.lock, lock))
    ) {
      const minimalCapacity = getAnyoneCanPayMinimumCapacity(lock);
      txSkeleton = txSkeleton.update('outputs', (outputs) => {
        output.cellOutput.capacity = BI.from(output.cellOutput.capacity)
          .add(minimalCapacity)
          .toHexString();
        return outputs.set(index, output);
      });
    }
  });

  inputs.forEach((input, index) => {
    const { lock } = input.cellOutput;
    if (
      isAnyoneCanPay(lock) &&
      outputs.some((o) => isSameScript(o.cellOutput.lock, lock))
    ) {
      txSkeleton = txSkeleton.update('witnesses', (witnesses) => {
        return witnesses.set(index, '0x');
      });
    }
  });

  let tx = common.prepareSigningEntries(txSkeleton, {
    config: sporeConfig.lumos,
  });
  const signedWitnesses = new Map<string, string>();
  const signingEntries = tx.get('signingEntries')!;
  for (let i = 0; i < signingEntries.size; i += 1) {
    const entry = signingEntries.get(i)!;
    if (entry.type === 'witness_args_lock') {
      const {
        cellOutput: { lock },
      } = inputs.get(entry.index)!;
      // skip anyone-can-pay witness when cell lock not changed
      if (
        !isSameScript(lock, fromLock!) &&
        outputs.some((o) => isSameScript(o.cellOutput.lock, lock))
      ) {
        continue;
      }

      const { message, index } = entry;
      if (signedWitnesses.has(message)) {
        const signedWitness = signedWitnesses.get(message)!;
        tx = tx.update('witnesses', (witnesses) => {
          return witnesses.set(index, signedWitness);
        });
        continue;
      }

      let signature = await signMessage(message);

      // Fix ECDSA recoveryId v parameter
      // https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v
      let v = Number.parseInt(signature.slice(-2), 16);
      if (v >= 27) v -= 27;
      signature = ('0x' +
        signature.slice(2, -2) +
        v.toString(16).padStart(2, '0')) as `0x${string}`;

      const signedWitness = bytes.hexify(
        blockchain.WitnessArgs.pack({
          lock: commons.omnilock.OmnilockWitnessLock.pack({
            signature: bytes.bytify(signature!).buffer,
          }),
        }),
      );
      signedWitnesses.set(message, signedWitness);

      tx = tx.update('witnesses', (witnesses) => {
        return witnesses.set(index, signedWitness);
      });
    }
  }

  const signedTx = helpers.createTransactionFromSkeleton(tx);
  return signedTx;
}
