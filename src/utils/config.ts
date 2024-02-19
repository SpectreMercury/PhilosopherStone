import { forkSporeConfig, predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';
import { initializeConfig } from '@ckb-lumos/config-manager';

const sporeConfig: SporeConfig = process.env.NODE_ENV === 'development' ?  predefinedSporeConfigs.Testnet : predefinedSporeConfigs.Mainnet;

// const sporeConfig: SporeConfig = process.env.NODE_ENV === 'development' ?  predefinedSporeConfigs.Mainnet : predefinedSporeConfigs.Mainnet;
initializeConfig(sporeConfig.lumos);
setSporeConfig(sporeConfig);
console.log(sporeConfig);
export {
  sporeConfig,
};
