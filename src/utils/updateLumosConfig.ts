import { RPC } from "@ckb-lumos/lumos";
import { createRpcResolver, predefined, refreshScriptConfigs } from "@ckb-lumos/lumos/config";
import { sporeConfig } from "./config";
import { config } from "process";

export const getLumosScript = async () => {
    const TESTNET_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
    const MAINNET_CKB_RPC_URL = "https://mainnet.ckb.dev/rpc";
    const rpc = new RPC(process.env.NODE_ENV === 'development' ? MAINNET_CKB_RPC_URL: MAINNET_CKB_RPC_URL)
    const refreshed = await refreshScriptConfigs(predefined.LINA.SCRIPTS, {resolve: createRpcResolver(rpc)})
    console.log(refreshed)
    return {SCRIPTS: refreshed, PREFIX: 'ckt'}
}