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

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    if(body?.action == 'save') {
        await saveAction(body.key, body.value)
    }
    if(body?.action == 'update') {
        await updateGiftReadStatusAction(body.key, body.value)
    }
    return NextResponse.json({data: body}, {status: 200})
}