import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { HistoryRecord } from '@/types/History';
import { setInProcessGift, setUnavailableGifts } from "../gift/route";
import { HashkeyObj } from "@/types/Hashkey";

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

const getHashKeyHistory = async(k: string, start: number, end: number) => {
    let rlt = await kv.lrange(`${k}-hashKey`, start, end);
    return NextResponse.json({data: rlt, errno: 200}, {status: 200});
}

const getHashKeyGift = async(k: string) => {
    let rlt = await kv.get(`${k}-hashKey`);
    return NextResponse.json({ data: rlt, errno: 200 }, { status: 200 });
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
            return await withErrorHandling(getHashKeyHistory, body.key, body.start || 0, body.end || 10);
        case 'deleteHash':
            return await withErrorHandling(deleteHash, body.key);
        default:
            return handleError('Invalid action', 400);
    }
}   

