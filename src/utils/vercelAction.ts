import { kv } from '@vercel/kv'
import { enqueueSnackbar } from 'notistack';

export async function saveAction (k: string, v: Object | string) {
    if (typeof v === 'object' && v !== null) {
        v = JSON.stringify(v)
    }

    try {
        await kv.set(k, v)
    } catch {
        enqueueSnackbar('Save KV Error', {variant: 'error'}) 
    }
}

export async function UpdateGiftReadStatusAction (k: string, v: string ) {
    let result: Array<string> | null = await kv.get(k)
    if (result && result.length > 0) {
        result.push(v);
    } else {
        result = [v]
    }
    try {
        await kv.set(k, result)
        return true
    } catch {
        return false
    }
}