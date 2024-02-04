import React, { useState, useEffect } from 'react';
import { RPC } from "@ckb-lumos/lumos";
import { Config, createRpcResolver, predefined, refreshScriptConfigs, ScriptConfig } from "@ckb-lumos/lumos/config";
import { sporeConfig } from '@/utils/config';

interface LumosScriptResult {
    data: ScriptConfig | null;
    error: Error | null;
}

const useLumosScript = (): LumosScriptResult => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const getLumosScript = async () => {
            try {
                const TESTNET_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
                const MAINNET_CKB_RPC_URL = "https://mainnet.ckb.dev/rpc";
                const rpc = new RPC(process.env.NODE_ENV === 'development' ? TESTNET_CKB_RPC_URL : MAINNET_CKB_RPC_URL);
                const refreshed = await refreshScriptConfigs(sporeConfig.lumos.SCRIPTS, { resolve: createRpcResolver(rpc) });
                setData(refreshed);
            } catch (e) {
                setError(e as Error);
            }
        };

        getLumosScript();
    }, []);

    return { data, error };
};

export default useLumosScript;
