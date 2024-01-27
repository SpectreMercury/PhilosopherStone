import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { HistoryRecord } from '@/types/History';
import { setInProcessGift, setUnavailableGifts } from "../gift/route";

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

const setHistory = async (k: string, record: HistoryRecord) => {
    const now = new Date();
    const recordWithDate = { ...record, date: now };
    let rlt = await kv.lpush(`${k}-history`, recordWithDate);
    console.log(record.sporeId)
    await setUnavailableGifts(k, record.id, record.sporeId || 'created'); 
    return NextResponse.json({ data: rlt, errno: 200 }, { status: 200 });
}

const getHistory = async (k: string, start: number, end: number) => {
    let previousStatus: HistoryRecord[] | null = await kv.lrange(`${k}-history`, start, end)
    return NextResponse.json({ data: previousStatus, errno: 200 }, { status: 200 });
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
        case 'setHistory':
            return await withErrorHandling(setHistory, body.key, body.record);
        case 'getHistory':
            return await withErrorHandling(getHistory, body.key, body.start || 0, body.end || 10);
        default:
            return handleError('Invalid action', 400);
    }
}   

