import { forkSporeConfig, predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';

const sporeConfig: SporeConfig = predefinedSporeConfigs.Mainnet;

setSporeConfig(sporeConfig);

export {
  sporeConfig,
};