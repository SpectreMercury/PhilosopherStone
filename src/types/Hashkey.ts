export interface HashkeyObj {
    [key: string]:{
        sporeId: string;
        senderWalletAddress: string;
        txHash: string;
    }
}

export interface SporeItem {
    sporeId: string;
    senderWalletAddress: string;
    txHash: string;
    date?: string;
}