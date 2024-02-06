import { sporeConfig } from "@/utils/config";

interface JoyIDConfigProps {
    name: string;
    logo?: string;
    rpcURL?: string;
    redirectURL?: string;
    network?: 'mainnet' | 'testnet';
}

export const JoyIDConfig:JoyIDConfigProps = {
    name: 'philosopherstone',
    rpcURL: sporeConfig.ckbNodeUrl,
    network: 'mainnet'
}