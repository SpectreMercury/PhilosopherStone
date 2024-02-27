import { boxData } from "@/types/BlindBox";
import { enqueueSnackbar } from "notistack";
import { HistoryRecord } from '../types/History';
import { GiftProps } from "@/types/Gifts";
import { SporeItem } from "@/types/Hashkey";
import { helpers } from "@ckb-lumos/lumos";

// api.ts
export interface BlindBoxAPIParams {
  action: string;
  key: string;
  name?: string;
  ids?: string[] | boxData[];
}


export interface GiftParams {
  action: string;
  key: string;
  name?: string;
  id?: string
  ids?: string[] | boxData[];
  value?: GiftProps
}

export interface HistoryParams {
  action: string;
  key: string;
  record?: HistoryRecord
}

export interface HashkeyParams {
  action: string;
  key: string;
  record?: SporeItem;
  receiverAccount?: string;
}

export interface WalletParams {
  action: string;
  txSkeleton?: helpers.TransactionSkeletonType;
  sporeId?: string;
  receiverAccounts?: string;
}

export interface WidthdrawParams {
  action: string;
  key: string;
  toAddress?: string;
  value?: string;
  txHash?: string;
}

export const fetchBlindBoxAPI = async (
  params: BlindBoxAPIParams
): Promise<any> => {
  try {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error fetching data from the Blind Box API', {variant: 'error'})
  }
};

export const fetchGiftAPI = async (
  params: GiftParams
): Promise<any> => {
  try {
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error fetching data from the gift API', {variant: 'error'})
  }
};

export const fetchHashkeyAPI = async (
  params: HashkeyParams
): Promise<any> => {
  try {
    const response = await fetch('/api/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error fetching data from the history box API', {variant: 'error'})
  }
};

export const fetchHistoryAPI = async (
  params: HistoryParams
): Promise<any> => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error fetching data from the blind box API', {variant: 'error'})
  }
};

export const fetchWithdrawAPI = async (
  params: WidthdrawParams
): Promise<any> => {
  try {
    const response = await fetch('/api/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error Fetch WithdrawAPI', {variant: 'error'})
  }
}

export const fetchWalletAPI = async (
  params: WalletParams
): Promise<any> => {
  try {
    const response = await fetch('/api/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar('Error get Wallet', {variant: 'error'})
  }
};
