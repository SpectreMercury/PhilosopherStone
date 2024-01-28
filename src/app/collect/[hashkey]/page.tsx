"use client"

import { HashkeyObj, SporeItem } from '@/types/Hashkey';
import { formatDate, formatString } from '@/utils/common';
import { fetchGiftAPI, fetchHashkeyAPI } from '@/utils/fetchAPI';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { config as _config, getAccounts } from '@/utils/transferSporeWithAgent';
import { getSporeById, transferSpore } from '@spore-sdk/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { config, helpers } from '@ckb-lumos/lumos';
import { router } from '@/server/trpc';
import { getLumosScript } from '@/utils/updateLumosConfig';

const Hashkey: React.FC = () => {
    const pathName = usePathname();
    const router = useRouter();
    const pathAddress = pathName.split("/")[pathName.split('/').length - 1]
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [sporeInfo, setSporeInfo] = useState<SporeItem>();
    const [receiveProcessing, setReceiveProcessing] = useState<boolean>(false);
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);

    const getHashkeyGift = async(key: string) => {
        let rlt = await fetchHashkeyAPI({
            action: 'getHashKeyGift',
            key,
        });
        setSporeInfo(rlt.data);
        getGiftInfo(rlt.data.sporeId)
    }

    const getGiftInfo = async(key: string) => {
        let rlt = await fetchGiftAPI({
            action: 'getGiftInfo',
            key
        })
        if (rlt.data && rlt.data.giftMessage) {
            setGiftMessage(rlt.data.giftMessage);
        }
    }

    const deleteHashkey = async(key: string) => {
        let rlt = await fetchGiftAPI({
            action: 'deleteHash',
            key
        });
        return rlt
    }

    const receiveGift = async(sporeId: string) => {
        setReceiveProcessing(true);
        const sporeConfig = await _config();
        const accounts = await getAccounts();
        const latestLumosScript = await getLumosScript();
        const receiverAccounts = walletAddress!!;
        const sporeCell = await getSporeById(`${sporeId}`, sporeConfig);
        console.log({
            outPoint: sporeCell.outPoint!,
            fromInfos: [accounts.AGENT.address],
                toLock: helpers.parseAddress(receiverAccounts, {
                config: latestLumosScript,
            }),
            config: sporeConfig,
        })
        const { txSkeleton, outputIndex } = await transferSpore({
            outPoint: sporeCell.outPoint!,
            fromInfos: [accounts.AGENT.address],
            toLock: helpers.parseAddress(receiverAccounts, {
                config: latestLumosScript,
            }),
            config: sporeConfig,
        });
        const txHash = await accounts.AGENT.signAndSendTransaction(txSkeleton);
        setReceiveProcessing(false);
        deleteHashkey(pathAddress);
        router.push(`/receipt/${txHash}?date=${sporeInfo?.date}&type=receive`)
    }

    useEffect(() => {
        if(pathAddress) {
            getHashkeyGift(pathAddress);
        } else {
            //TODO
        }
    }, [pathAddress])


    return (
        <div className='px-4'>
            <div className='w-full flex justify-center mt-12'>
                <img src={`/api/media/${sporeInfo?.sporeId}`} width={300} height={200} className="px-4" alt="Gift" /> 
            </div>
            <div className='w-full h-12 bg-primary006 rounded-md flex justify-center mt-8 items-center'>
                {giftMessage && <p className="font-SourceSanPro text-white001 text-body1mb">“{giftMessage}”</p>}
            </div>
            <div className='w-full flex justify-center mt-2'>
                <p className="font-SourceSanPro text-white001 text-body1mb">From: [{sporeInfo ? formatString(sporeInfo?.senderWalletAddress!!): '*****'}]</p>
            </div>
            <div className='w-full flex justify-center mt-2 font-SourceSanPro text-body1mb text-white005'>{ sporeInfo ? formatDate(sporeInfo?.date!!): '----:--:--' }</div>
            <button 
                disabled={receiveProcessing}
                onClick={() => {
                    if(sporeInfo) {
                        receiveGift(sporeInfo.sporeId);
                    }
                }}
                className="w-full h-12 mt-2 text-buttonmb font-SourceSansPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded"
            >
                {receiveProcessing ? 'Receiving...' :'Receive it'}
            </button>
        </div>
    )
}

export default Hashkey