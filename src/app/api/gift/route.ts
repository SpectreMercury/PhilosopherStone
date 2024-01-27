import getTransaction from '@/utils/getTransactionStatus';
import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'

function handleError(error: string, errno: number = 400) {
    return NextResponse.json({ error, errno }, { status: errno });
}

async function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  ...args: T
): Promise<NextResponse> {
  try {
    const result = await fn(...args);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message || 'An error occurred');
  }
}

async function saveAction(k: string, id: string, v: string | Object) {
  let value = v;
  if (typeof v === 'object' && v !== null) {
    value = JSON.stringify(v);
  }
  await kv.lpush(`${k}-received`, {id, date: new Date()})
  await kv.set(id, v);
}

async function getTransactionStatus (k: string) {
  const transactionInfo = await getTransaction(k);
  const status = transactionInfo.result.tx_status.status;
  return status
} 

async function updateGiftReadStatusAction(k: string, newValue: string) {
  const resultStr = await kv.get(k) as string | null;
  let result: string[] = [];
  
  if (resultStr) {
    result = JSON.parse(resultStr);
  }
  
  result.push(newValue);
  await kv.set(k, JSON.stringify(result));
}

export async function setUnavailableGifts(k: string, txHash: string, sporeId: string) {
  return await kv.hset(`${k}-unavailable`, {[txHash]: sporeId});
} 

export async function getUnavailableGifts(k: string, id: string) {
  return await kv.hgetall(`${k}-unavailable`);
} 

export async function removeUnavailableGifts(k: string, txHash: string) {
  return await kv.hdel(`${k}-unavailable`, txHash)
}

export async function setInProcessGift(k: string, id: string) {
  return await kv.lpush(`${k}-inProcessGift`, id);
}

export async function getInProcessGifts(k: string) {
  return await kv.lrange(`${k}-inProcessGift`, 0, -1);
}

export async function removeInProcessGift(k: string, id: string) {
  return await kv.lrem(`${k}-inProcessGift`, 0, id)
}

async function getReceivedGifts(k: string, start: number, end: number) {
  return await kv.lrange(`${k}-received`, start, end);
}

async function getGiftInfo(k: string) {
  return await kv.get(k)
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    let actionResult;

    switch (body?.action) {
        case 'save':
            actionResult = await withErrorHandling(saveAction, body.key, body.id, body.value);
            break;
        case 'update':
            actionResult = await withErrorHandling(updateGiftReadStatusAction, body.key, body.value);
            break;
        case 'getReceivedGifts':
            actionResult = await withErrorHandling(getReceivedGifts, body.key, body.start | 0, body.end | 10);
            break;
        case 'getGiftInfo':
            actionResult = await withErrorHandling(getGiftInfo, body.key);
            break;
        case 'getTransactionStatus':
            actionResult = await withErrorHandling(getTransactionStatus, body.key);
            break;
        case 'setInProcessGift':
            actionResult = await withErrorHandling(setInProcessGift, body.key, body.id);
            break;
        case 'getInProcessGifts':
            actionResult = await withErrorHandling(getInProcessGifts, body.key);
            break;
        case 'removeInProcessGift':
            actionResult = await withErrorHandling(removeInProcessGift, body.key, body.id);
            break;
        case 'removeInProcessGift':
            actionResult = await withErrorHandling(removeInProcessGift, body.key, body.id);
            break;
        case 'getUnavailableGifts':
            actionResult = await withErrorHandling(getUnavailableGifts, body.key, body.id);
            break;
        case 'removeUnavailableGifts':
            actionResult = await withErrorHandling(removeUnavailableGifts, body.key, body.id);
            break;
        default:
            actionResult = handleError('Invalid action', 400);
    }

    return actionResult;
}
