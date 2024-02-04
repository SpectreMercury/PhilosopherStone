import { predefinedSporeConfigs } from '@spore-sdk/core';
import { createSecp256k1Wallet } from './agentWallet';
import { getLumosScript } from './updateLumosConfig';

/**
 * SporeConfig provides spore/cluster's detailed info like ScriptIds and CellDeps.
 * It is a necessary part for constructing spore/cluster transactions.
 */

// export const config = (async() => {
//     const latestLumosScript = await getLumosScript();
//     let latest = JSON.parse(JSON.stringify(predefinedSporeConfigs.Aggron4))
//     latest['lumos'] = latestLumosScript
//     return latest
// });


// export const getAccounts = async() => {
//   const configuration = await config();
//   return {
//     AGENT: createSecp256k1Wallet(process.env.NEXT_PUBLIC_AGENT_PRIVATE_KEY!!, configuration)
//   };
// }