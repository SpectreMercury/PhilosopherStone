import { RPC } from "@ckb-lumos/lumos";
import { createRpcResolver, predefined, refreshScriptConfigs } from "@ckb-lumos/lumos/config";

export const getLumosScript = async () => {
    const TESTNET_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
    const MAINNET_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
    const rpc = new RPC(process.env.NODE_ENV === 'development' ? TESTNET_CKB_RPC_URL: MAINNET_CKB_RPC_URL)
    const refreshed = await refreshScriptConfigs(predefined.AGGRON4.SCRIPTS, {resolve: createRpcResolver(rpc)})
    return {SCRIPTS: refreshed, PREFIX: 'ckt'}
}