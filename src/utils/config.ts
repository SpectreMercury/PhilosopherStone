import { forkSporeConfig, predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';

const sporeConfig: SporeConfig = forkSporeConfig(predefinedSporeConfigs.Mainnet, {
  lumos: {
    PREFIX: 'ckt',
    SCRIPTS: {
      ...predefinedSporeConfigs.Mainnet.lumos.SCRIPTS,
      OMNILOCK: {
        ...predefinedSporeConfigs.Mainnet.lumos.SCRIPTS.OMNILOCK!,
        TX_HASH: "0xc76edf469816aa22f416503c38d0b533d2a018e253e379f134c3985b3472c842",
        INDEX: '0x0',
      },
    },
  },
});

setSporeConfig(sporeConfig);

export {
  sporeConfig,
};