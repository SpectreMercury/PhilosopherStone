interface JoyIDConfigProps {
    name: string;
    logo: string;
    joyidAppURL: string;
    network: "testnet" | "mainnet"
}

export const JoyIDConfig:JoyIDConfigProps = {
    name: 'philosopherstone',
    logo: '',
    // joyidAppURL:"https://testnet.joyid.dev",
    joyidAppURL:"https://app.joy.id/",
    network: "mainnet"
}