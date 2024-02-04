import { createSecp256k1Wallet } from "@/utils/agentWallet";
import { sporeConfig } from "@/utils/config";
import { getLumosScript } from "@/utils/updateLumosConfig";
import { helpers } from "@ckb-lumos/lumos";
import { predefinedSporeConfigs } from "@spore-sdk/core";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

function handleError(error: string, errno: number = 400) {
    return NextResponse.json({ error, errno }, { status: errno });
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

async function getAddress() {
  const privateKey = process.env.PRIVATE_WALLET_KEY;
  if (!privateKey) {
    throw new Error("Key Error");
  }
  const wallet = await createSecp256k1Wallet(privateKey, sporeConfig);

  return NextResponse.json({ wallet, address: wallet.address });
}

async function signAndSendTransaction(txSkeleton: helpers.TransactionSkeletonType) {
  const privateKey = process.env.PRIVATE_WALLET_KEY;

  const wallet = createSecp256k1Wallet(privateKey!!, sporeConfig);
  const transactionHash = await wallet.signAndSendTransaction(txSkeleton);
  return NextResponse.json({ txHash: transactionHash }, { status: 200 });
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
        case 'getAddress':
            return await withErrorHandling(getAddress);
        case 'signAndSendTransaction':
            return await withErrorHandling(signAndSendTransaction, body.txSkeleton);
        default:
            return handleError('Invalid action', 400);
    }
}   