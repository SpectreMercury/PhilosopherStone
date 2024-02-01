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
import WalletModal from '@/app/_components/WalletModal/WalletModal';
import Image from 'next/image';
import Link from 'next/link';

const Hashkey: React.FC = () => {
    const pathName = usePathname();
    const router = useRouter();
    const pathAddress = pathName.split("/")[pathName.split('/').length - 1]
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [sporeInfo, setSporeInfo] = useState<SporeItem>();
    const [receiveProcessing, setReceiveProcessing] = useState<boolean>(false);
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
    const [showHeaderModal, setHeaderShowModal] = useState(false);
    const [giftStatus, setGiftStatus] = useState<'pending'|'success'|'notfound'>('pending');

    const getHashkeyGift = async(key: string) => {
        let rlt = await fetchHashkeyAPI({
            action: 'getHashKeyGift',
            key,
        });
        if(rlt.data) {
            setSporeInfo(rlt.data);
            getGiftInfo(rlt.data.sporeId)
            setGiftStatus('success')
        } else {
            setGiftStatus('notfound');
        }
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
        if(!walletAddress) {
            setHeaderShowModal(true);
        }
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
        <div className='px-4 flex-1 flex flex-col justify-center'>
            {giftStatus === 'success' && (
                <>
                    {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)}/>}
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
                </>)
            }
            {
                giftStatus === 'pending' && (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <div className='relativemt-12 flex flex-col items-center'>
                            <Image alt={'collect-pending'} src={`/svg/blindbox-animation-1.svg`} className="rounded mb-8" width={170} height={170}/>
                            <p className=' text-hd2mb font-SourceSanPro text-white001'>Checking Gift Status On Chain...</p>
                        </div>
                    </div>
                )
            }
            {
                giftStatus === 'notfound' && (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <div className='relativemt-12 flex flex-col items-center'>
                            <Image alt={'collect-pending'} src={`/svg/melt-404.svg`} className="rounded mb-8" width={170} height={170}/>
                            <p className=' text-hd2mb font-SourceSanPro text-white001'>Gift is disappearing</p>
                        </div>
                        <Link href={'/'} className='w-full flex items-center justify-center h-12 text-buttonmb font-SourceSansPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded mt-8'>
                            Back to Home
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default Hashkey