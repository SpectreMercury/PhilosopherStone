import { predefinedSporeConfigs } from '@spore-sdk/core';
import { BI, Script } from '@ckb-lumos/lumos';
import { sporeConfig } from './config';

type ScriptName =
  keyof (typeof sporeConfig)['lumos']['SCRIPTS'];

export function getScriptConfig(name: ScriptName) {
  const script = sporeConfig.lumos.SCRIPTS[name];
  if (!script) {
    throw new Error(`Script ${name} not found`);
  }
  return script;
}

export function isAnyoneCanPayScript(script: Script) {
  const anyoneCanPayLockScript = getScriptConfig('ANYONE_CAN_PAY');
  return (
    script.codeHash === anyoneCanPayLockScript.CODE_HASH &&
    script.hashType === anyoneCanPayLockScript.HASH_TYPE
  );
}

export function isOmnilockScript(script: Script) {
  const omnilockScript = getScriptConfig('OMNILOCK');
  return (
    script.codeHash === omnilockScript.CODE_HASH &&
    script.hashType === omnilockScript.HASH_TYPE
  );
}

export function getOmnilockAnyoneCanPayModeLock(lock: Script) {
  if (!isOmnilockScript(lock)) {
    throw new Error('Invalid omnilock script');
  }
  const args = lock.args.slice(0, 44) + '020000';
  return {
    codeHash: lock.codeHash,
    hashType: lock.hashType,
    args,
  };
}

export function isSameScript(
  script1: Script | undefined,
  script2: Script | undefined,
) {
  if (!script1 || !script2) {
    return false;
  }
  return (
    script1.codeHash === script2.codeHash &&
    script1.hashType === script2.hashType &&
    script1.args === script2.args
  );
}

export function hasOwnership(ownerLock: Script, targetLock: Script) {
  if (isAnyoneCanPay(targetLock)) {
    return targetLock.args.slice(0, 44) === ownerLock.args.slice(0, 44);
  }
  return isSameScript(ownerLock, targetLock);
}

export function isAnyoneCanPay(script: Script) {
  if (isOmnilockScript(script)) {
    return script.args.slice(44, 46) === '02';
  }

  return isAnyoneCanPayScript(script);
}

export function getAnyoneCanPayMinimumCapacity(script: Script) {
  if (!isAnyoneCanPay(script)) {
    return 0;
  }

  // https://blog.cryptape.com/omnilock-a-universal-lock-that-powers-interoperability-1#heading-anyone-can-pay-mode
  if (isOmnilockScript(script)) {
    const minimumCKB = BI.from(`0x${script.args.slice(46, 48)}`).toNumber();
    return 10 ** minimumCKB;
  }

  // https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md#script-structure
  if (isAnyoneCanPayScript(script)) {
    if (script.args.length === 42) {
      return 0;
    }
    const minimumCKB = BI.from(`0x${script.args.slice(42, 44)}`).toNumber();
    return 10 ** minimumCKB;
  }

  return 0;
}
