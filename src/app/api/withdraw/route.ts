import { createSecp256k1Wallet } from "@/utils/agentWallet";
import { sporeConfig } from "@/utils/config";
import { getLumosScript } from "@/utils/updateLumosConfig";
import { helpers } from "@ckb-lumos/lumos";
import { getSporeById, predefinedSporeConfigs, transferSpore } from "@spore-sdk/core";
import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

function handleError(error: string, errno: number = 400) {
    return NextResponse.json({ error: 'Collect Gift Failed, Try agian later', errno }, { status: errno });
}

async function withErrorHandling<T extends any[]>(
    fn: (...args: T) => Promise<NextResponse>,
    ...args: T
): Promise<NextResponse> {
    try {
        return await fn(...args);
    } catch (error) {
        return handleError(error as string);
    }
}

async function withdraw(walletAddress: string,toAddress: string, value: string, txHash: string) {
    let withdraw = await kv.lpush(`${walletAddress}-withdraw-history`, {
        fromAddress: walletAddress,
        toAddress,
        value,
        txHash,
        time: new Date(),
    })
    return NextResponse.json({ errno: 200 }, { status: 200 });
}

async function widthHistory(walletAddress: string, start: number, end: number) {
    let data = await kv.lrange(`${walletAddress}-withdraw-history`, start, end);
    return NextResponse.json({ errno: 200, data }, { status: 200 });
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
        case 'withdraw':
            return await withErrorHandling(withdraw,body.key, body.toAddress, body.value, body.txHash);
        case 'widthHistory':
            return await withErrorHandling(widthHistory, body.key, body.start || 0, body.end || 20);
        default:
            return handleError('Invalid action', 400);
    }
}   