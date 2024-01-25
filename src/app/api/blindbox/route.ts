import SporeService from "@/spore";
import { boxData } from "@/types/BlindBox";
import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

interface BlindBox {
  id: string;
  boxData: boxData[]; 
}

async function getCurrentBlindBoxes(k: string): Promise<BlindBox[]> {
    let currBlindBoxes: BlindBox[] | null = await kv.get(k);
    return currBlindBoxes || [];
}

async function getInBlindBoxGifts(k: string): Promise<string[]> {
  let inBlindBoxGifts: string [] | null = await kv.get(k)
  return inBlindBoxGifts || [];
}

function handleError(error: string, errno: number = 400) {
    return NextResponse.json({ error, errno }, { status: errno });
}

const create = async (k: string, boxName: string, ids = []) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  let inBlindBoxGifts = await getInBlindBoxGifts(`${k}-include`);
  if (currBlindBoxes.some(box => box.id === boxName)) {
    return handleError('A Blind Box with the same name already exists.');
  }

  const newBlindBox: BlindBox = { id: boxName, boxData: ids };
  currBlindBoxes.push(newBlindBox);
  await kv.set(k, JSON.stringify(currBlindBoxes));
  await kv.set(`${k}-include`, JSON.stringify(inBlindBoxGifts.concat(ids)))
  return NextResponse.json({ data: [], message: 'successful', errno: 200 }, { status: 200 });
}

const getList = async (k: string) => {
    return await getCurrentBlindBoxes(k);
}

const getInBlindBoxList = async(k: string) => {
  let rlt : string[] | null = await kv.get(`${k}-include`);
  return NextResponse.json({ data: rlt, message: 'successful', errno: 200 }, { status: 200 });
}

const getBlindBoxByName = async (k: string, boxName: string): Promise<NextResponse> => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  const box = currBlindBoxes.find(box => box.id === boxName);

  if (!box) {
    return handleError('Blind box not found.');
  }

  return NextResponse.json({ box }, { status: 200 });
}

const add = async (k: string, boxName: string, giftIds: string[]) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  let inBlindBoxGifts = await getInBlindBoxGifts(`${k}-include`);
  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex === -1) {
    return handleError('No Blind Box found with the given name.');
  }

  const hasDuplicates = giftIds.some(id => inBlindBoxGifts.includes(id));
  if (hasDuplicates) {
    return handleError('Some gifts are already present in the list.');
  }

  const newGiftObjects = giftIds.map(id => ({ id }));
  currBlindBoxes[boxIndex].boxData.push(...newGiftObjects);
  await kv.set(k, JSON.stringify(currBlindBoxes));
  await kv.set(`${k}-include`, JSON.stringify(inBlindBoxGifts.concat(giftIds)))
  return NextResponse.json({ data: currBlindBoxes[boxIndex].boxData, errno: 200 }, { status: 200 });
};

const remove = async (k: string, boxName: string, giftIds: string[]) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  let inBlindBoxGifts = await getInBlindBoxGifts(`${k}-include`);

  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex === -1) {
    return handleError('No Blind Box found with the given name.');
  }

  inBlindBoxGifts = inBlindBoxGifts.filter(id => !giftIds.includes(id));

  currBlindBoxes[boxIndex].boxData = currBlindBoxes[boxIndex].boxData.filter(gift => !giftIds.includes(gift.id));
  await kv.set(k, JSON.stringify(currBlindBoxes));
  await kv.set(`${k}-include`, JSON.stringify(inBlindBoxGifts));
  return NextResponse.json({ data: currBlindBoxes[boxIndex].boxData, errno: 200 }, { status: 200 });
};

const clear = async (k: string, giftIds: string[]) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  
  currBlindBoxes.forEach(blindBox => {
    blindBox.boxData = blindBox.boxData.filter(gift => !giftIds.includes(gift.id));
  });

  await kv.set(k, JSON.stringify(currBlindBoxes));
  return NextResponse.json({ data: currBlindBoxes, errno: 200 }, { status: 200 });
};

const send = async (k: string, boxName: string) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  const box = currBlindBoxes.find(box => box.id === boxName);

  if (!box || box.boxData.length === 0) {
    return handleError('No Blind Box found with the given name or Blind Box is empty.');
  }

  const randomIndex = Math.floor(Math.random() * box.boxData.length);
  const giftObject = box.boxData[randomIndex];
  return NextResponse.json({ giftId: giftObject.id, errno: 200 }, { status: 200 }); 
};

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
      case 'create':
        return await create(`${body.key}-blindbox`, body.name);
      case 'getList':
        return NextResponse.json({ data: await getList(`${body.key}-blindbox`), errno: 200 }, { status: 200 });
      case 'add':
        return await add(`${body.key}-blindbox`, body.name, body.ids);
      case 'getInBlindBoxList':
        return await getInBlindBoxList(`${body.key}-blindbox`);
      case 'remove':
        return await remove(`${body.key}-blindbox`, body.name, body.ids);
      case 'send':
        return await send(`${body.key}-blindbox`, body.name);
      case 'clear':
        return await clear(`${body.key}-blindbox`, body.ids);
      case 'getBoxByName':
        return await getBlindBoxByName(`${body.key}-blindbox`, body.name);
      default:
        return handleError('Invalid action');
    }
}

