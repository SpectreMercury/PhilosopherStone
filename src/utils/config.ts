import { forkSporeConfig, predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';

let sporeConfig: SporeConfig = process.env.NODE_ENV === 'development' ?  predefinedSporeConfigs.Testnet : predefinedSporeConfigs.Mainnet;
// initializeConfig(sporeConfig.lumos);
// setSporeConfig(sporeConfig);
sporeConfig = forkSporeConfig(predefinedSporeConfigs.Testnet, {
  lumos: {
    PREFIX: 'ckt',
    SCRIPTS: {
      ...predefinedSporeConfigs.Testnet.lumos.SCRIPTS,
      OMNILOCK: {
        ...predefinedSporeConfigs.Testnet.lumos.SCRIPTS.OMNILOCK!,
        CODE_HASH: "0xa7a8a4f8eadb4d9736d32cdbe54259d1ee8e23785e7c28d15a971a0dbdc14ca6",
        HASH_TYPE: "type",
        TX_HASH: "0x65de639c5f4822cef9be430c4884c2b7689147a6b0098f3aa4028d0f7f9689d1",
        INDEX: "0x0",
        DEP_TYPE: "code",
      },
    },
  },
});
export {
  sporeConfig,
};
