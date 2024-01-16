import { boxData } from "@/types/BlindBox";
import { enqueueSnackbar } from "notistack";

// api.ts
export interface BlindBoxAPIParams {
  action: string;
  key: string;
  name?: string;
  ids?: string[] | boxData[];
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
    enqueueSnackbar('Error fetching data from the blind box API', {variant: 'error'})
  }
};
