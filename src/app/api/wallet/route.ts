import { createSecp256k1Wallet } from "@/utils/agentWallet";
import { sporeConfig } from "@/utils/config";
import { getLumosScript } from "@/utils/updateLumosConfig";
import { helpers } from "@ckb-lumos/lumos";
import { getSporeById, predefinedSporeConfigs, transferSpore } from "@spore-sdk/core";
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

async function signAndSendTransaction(sporeId: string, receiverAccounts: string) {
  const privateKey = process.env.PRIVATE_WALLET_KEY;
  console.log('sporeId', sporeId);
  const sporeCell = await getSporeById(`${sporeId}`, sporeConfig);
  const wallet = await createSecp256k1Wallet(privateKey!!, sporeConfig);
  const { txSkeleton, outputIndex } = await transferSpore({
    outPoint: sporeCell.outPoint!,
    fromInfos: [wallet.address!!],
    toLock: helpers.parseAddress(receiverAccounts, {
        config: sporeConfig.lumos,
    }),
    config: sporeConfig,
  });
  console.log('--->', txSkeleton);
  const transactionHash = await wallet.signAndSendTransaction(txSkeleton);
  return NextResponse.json({ txHash: transactionHash }, { status: 200 });
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    console.log(body);
    switch (body.action) {
        case 'getAddress':
            return await withErrorHandling(getAddress);
        case 'signAndSendTransaction':
            return await withErrorHandling(signAndSendTransaction, body.sporeId, body.receiverAccounts);
        default:
            return handleError('Invalid action', 400);
    }
}   