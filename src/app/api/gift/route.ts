import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'


async function saveAction(k: string, v: string | Object) {
  let value = v;
  if (typeof v === 'object' && v !== null) {
    value = JSON.stringify(v);
  }
  await kv.set(k, value as string);
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

async function checkGiftStatusAction(k: string) {
  const resultStr: string[] | null = await kv.get(k);
  let result: string[] = [];
  
  if (resultStr) {
    result = resultStr;
  }
  return result
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    let rlt: any
    if(body?.action == 'save') {
      rlt = await saveAction(body.key, body.value)
    }
    if(body?.action == 'update') {
      rlt = await updateGiftReadStatusAction(body.key, body.value)
    }
    if(body?.action == 'checkStatus') {
      rlt = await checkGiftStatusAction(body.key)
    }
    return NextResponse.json({data: rlt}, {status: 200})
}

