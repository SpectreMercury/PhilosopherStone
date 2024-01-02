import { kv } from "@vercel/kv";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

interface BlindBox {
  id: string;
  boxData: string[]; 
}

const create = async (k: string, boxName: string) => {
  let currBlindBoxes: BlindBox[] | null = await kv.get(k);
  currBlindBoxes = currBlindBoxes ? currBlindBoxes : [];
  const existingBoxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (existingBoxIndex === -1) {
    const newBlindBox: BlindBox = { id: boxName, boxData: [] };
    currBlindBoxes.push(newBlindBox);
    await kv.set(k, JSON.stringify(currBlindBoxes));
    return {}
  } else {
    return { error: 'A blind box with the same name already exists.' };
  }
}

const getList = async (k: string) => {
    let list: BlindBox[] | null = await kv.get(k)
    if (!list) {
        list = []
    } 
    return list
}

const getBlindBoxByName = async (k: string, boxName: string): Promise<{ box?: BlindBox, error?: string }> => {
  console.log(k)
  let currBlindBoxes: BlindBox[] | null = await kv.get(k);

  if (!currBlindBoxes) {
    return { error: 'No blind boxes found.' };
  }

  const box = currBlindBoxes.find(box => box.id === boxName);

  if (!box) {
    return { error: 'Blind box not found.' };
  }

  return { box };
}

const add = async (k: string, boxName: string, giftIds: string[]) => {
  let currBlindBoxes: BlindBox[] | null = await kv.get(k);
  currBlindBoxes = currBlindBoxes ? currBlindBoxes : [];
  const existingBoxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (existingBoxIndex !== -1) {
    currBlindBoxes[existingBoxIndex].boxData.push(...giftIds);
    await kv.set(k, JSON.stringify(currBlindBoxes));
    return {};
  } else {
    return { error: 'No blind box found with the given name.' };
  }
}

const remove = async (k: string, boxName: string, giftIds: string[]) => {
  let currBlindBoxes: BlindBox[] | null = await kv.get(k);
  currBlindBoxes = currBlindBoxes ? currBlindBoxes : [];
  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex !== -1) {
    currBlindBoxes[boxIndex].boxData = currBlindBoxes[boxIndex].boxData.filter(id => !giftIds.includes(id));
    await kv.set(k, JSON.stringify(currBlindBoxes));
    return {};
  } else {
    return { error: 'No blind box found with the given name.' };
  }
}

const send = async (k: string, boxName: string): Promise<{ giftId?: string, error?: string }> => {
  let currBlindBoxes: BlindBox[] | null = await kv.get(k);
  currBlindBoxes = currBlindBoxes ? currBlindBoxes : [];

  const boxIndex = currBlindBoxes.findIndex(box => box.id === boxName);

  if (boxIndex !== -1 && currBlindBoxes[boxIndex].boxData.length > 0) {
    const randomIndex = Math.floor(Math.random() * currBlindBoxes[boxIndex].boxData.length);
    const giftId = currBlindBoxes[boxIndex].boxData[randomIndex];

    return { giftId };
  } else {
    return { error: 'No blind box found with the given name or blind box is empty.' };
  }
}



export async function POST(req: NextRequest, res: NextApiResponse) {
    const body = await req.json();
    let rlt: any;
    let error: string | null = null;

    if(body?.action == 'create') {
        const response = await create(`${body.key}-blindbox`, body.name);
        if (response?.error) {
            error = response.error;
        }
        rlt = response
    }
    if(body?.action == 'getList') {
        rlt = await getList(`${body.key}-blindbox`)
    }
    if(body?.action == 'add') {
        const response = await add(`${body.key}-blindbox`, body.name, body.ids)
        if (response?.error) {
            error = response.error;
        }
        rlt = response
    }
    if(body?.action == 'remove') {
        const response = await remove(`${body.key}-blindbox`, body.name, body.id);
        if (response?.error) {
            error = response.error;
        }
        rlt = response
    }
    if(body?.action == 'send') {
        const response = await send(`${body.key}-blindbox`, body.name)
        if (response?.error) {
            error = response.error;
        }
        rlt = response
    }

    if(body?.action == 'getBoxByName') {
      const response = await getBlindBoxByName(`${body.key}-blindbox`, body.name)
      console.log(body.name)
      if (response?.error) {
          error = response.error;
      }
      rlt = response
    }

    if (error) {
        return NextResponse.json({ error }, { status: 400 }); 
    } else {
        return NextResponse.json({ data: rlt }, { status: 200 });
    }
}

