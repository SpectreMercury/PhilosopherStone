import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { HistoryRecord } from '@/types/History';
import { setInProcessGift, setUnavailableGifts } from "../gift/route";
import { HashkeyGift, HashkeyObj } from "@/types/Hashkey";
import { signAndSendTransactionApi } from "../wallet/route";

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
        console.log(error);
        return handleError(error as string);
    }
}

const getHashKeyHistory = async(k: string, start: number, end: number) => {
    let rlt = await kv.lrange(`${k}-hashKey`, start, end);
    return NextResponse.json({data: rlt, errno: 200}, {status: 200});
}

const getHashKeyGift = async(k: string) => {
    let rlt = await kv.get(`${k}-hashKey`);
    return NextResponse.json({ data: rlt, errno: 200 }, { status: 200 });
}

const checkAndGetHashKey = async (k: string, receiverAccount: string, uuid: string): Promise<NextResponse> => {
    const rlt: HashkeyGift | null = await kv.get(`${k}-hashKey`);
    const exists = rlt !== null;
    if (!exists) {
        return NextResponse.json({ data: exists, errno: 404 }, { status: 200 });
    }
    const userExist: Boolean | null = await kv.get(`${uuid}`)
    if (userExist) {
       return NextResponse.json({ data: userExist, errno: 403 }, { status: 200 });
    }
    uuid && kv.set(uuid, true, {ex: 86400});
    deleteHash(k); 
    try {
        let txHash = await signAndSendTransactionApi(rlt.sporeId, receiverAccount);
        return NextResponse.json({ data: {...rlt, tradeTx: txHash}, errno: 200 }, { status: 200 });
    } catch (error) {
        await kv.set(`${k}-hashKey`, rlt); 
        console.error("Failed to sign and send transaction:", error);
        return handleError('Transaction signing and sending failed', 500); 
    }    
}

const saveHashkey = async (k: string, record: HashkeyObj) => {
    let date = new Date();
    await kv.set(`${k}-hashKey`, {...record, date});
    await kv.lpush(`${record.senderWalletAddress}-hashKey`, {[k]: {...record, date}});
    return NextResponse.json({data: '', errno: 200}, {status: 200});
}

const deleteHash = async (k: string) => {
    await kv.del(`${k}-hashKey`);
    return NextResponse.json({data: '', errno: 200}, {status: 200});
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
        case 'saveHashkey':
            return await withErrorHandling(saveHashkey, body.key, body.record);
        case 'getHashKeyGift':
            return await withErrorHandling(getHashKeyGift, body.key);
        case 'getHashKeyHistory':
            return await withErrorHandling(getHashKeyHistory, body.key, body.start || 0, body.end || 20);
        case 'deleteHash':
            return await withErrorHandling(deleteHash, body.key);
        case 'checkAndGetHashKey':
            return await withErrorHandling(checkAndGetHashKey, body.key, body.receiverAccount, req.cookies.get('__gpi')?.value.split('UID=')[1] || '');
        default:
            return handleError('Invalid action', 400);
    }
}   

