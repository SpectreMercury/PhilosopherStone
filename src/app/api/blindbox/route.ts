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


function handleError(error: string) {
    return NextResponse.json({ error }, { status: 400 });
}

const create = async (k: string, boxName: string) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  if (currBlindBoxes.some(box => box.id === boxName)) {
    return handleError('A blind box with the same name already exists.');
  }

  const newBlindBox: BlindBox = { id: boxName, boxData: [] };
  currBlindBoxes.push(newBlindBox);
  await kv.set(k, JSON.stringify(currBlindBoxes));
  return NextResponse.json({ data: [], message: 'successful' }, { status: 200 });
}

const getList = async (k: string) => {
    return await getCurrentBlindBoxes(k);
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
  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex === -1) {
    return handleError('No blind box found with the given name.');
  }

  const newGiftObjects = giftIds.map(id => ({ id }));
  currBlindBoxes[boxIndex].boxData.push(...newGiftObjects);
  await kv.set(k, JSON.stringify(currBlindBoxes));
  return NextResponse.json({ data: currBlindBoxes[boxIndex].boxData }, { status: 200 });
};

const remove = async (k: string, boxName: string, giftIds: string[]) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex === -1) {
    return handleError('No blind box found with the given name.');
  }

  currBlindBoxes[boxIndex].boxData = currBlindBoxes[boxIndex].boxData.filter(gift => !giftIds.includes(gift.id));
  await kv.set(k, JSON.stringify(currBlindBoxes));
  return NextResponse.json({ data: currBlindBoxes[boxIndex].boxData }, { status: 200 });
};

const clear = async (k: string, giftIds: string[]) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  currBlindBoxes.forEach(blindBox => {
    blindBox.boxData = blindBox.boxData.filter(gift => !giftIds.includes(gift.id));
  });

  await kv.set(k, JSON.stringify(currBlindBoxes));
  return NextResponse.json({ data: currBlindBoxes }, { status: 200 });
};

const send = async (k: string, boxName: string) => {
  let currBlindBoxes = await getCurrentBlindBoxes(k);
  const box = currBlindBoxes.find(box => box.id === boxName);

  if (!box || box.boxData.length === 0) {
    return handleError('No blind box found with the given name or blind box is empty.');
  }

  const randomIndex = Math.floor(Math.random() * box.boxData.length);
  const giftObject = box.boxData[randomIndex];
  return NextResponse.json({ giftId: giftObject.id }, { status: 200 }); 
};

export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    switch (body.action) {
      case 'create':
        return await create(`${body.key}-blindbox`, body.name);
      case 'getList':
        return NextResponse.json({ data: await getList(`${body.key}-blindbox`) }, { status: 200 });
      case 'add':
        return await add(`${body.key}-blindbox`, body.name, body.ids);
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

