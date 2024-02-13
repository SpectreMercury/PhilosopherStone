export interface HashkeyObj {
    [key: string]:{
        sporeId: string;
        senderWalletAddress: string;
        txHash: string;
    }
}

export interface HashkeyGift {
    date: string;
    senderWalletAddress: string;
    sporeId: string;
    txHash: string;
}

export interface SporeItem {
    sporeId: string;
    senderWalletAddress: string;
    txHash: string;
    date?: string;
}