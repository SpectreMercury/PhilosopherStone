import { forkSporeConfig, predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';
import { initializeConfig } from '@ckb-lumos/config-manager';

const sporeConfig: SporeConfig = predefinedSporeConfigs.Testnet;

initializeConfig(sporeConfig.lumos);
setSporeConfig(sporeConfig);

export {
  sporeConfig,
};
