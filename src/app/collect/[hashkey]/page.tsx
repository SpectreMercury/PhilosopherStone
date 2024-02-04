"use client"

import { HashkeyObj, SporeItem } from '@/types/Hashkey';
import { formatDate, formatString } from '@/utils/common';
import { fetchGiftAPI, fetchHashkeyAPI, fetchWalletAPI } from '@/utils/fetchAPI';
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
        const senderAddress = await fetchWalletAPI({
            action: 'getAddress'
        })
        const { txSkeleton, outputIndex } = await transferSpore({
            outPoint: sporeCell.outPoint!,
            fromInfos: [senderAddress.address!!],
            toLock: helpers.parseAddress(receiverAccounts, {
                config: latestLumosScript,
            }),
            config: sporeConfig,
        });
        const txHash = await fetchWalletAPI({
            action: 'signAndSendTransaction',
            txSkeleton
        });
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
        <div className='px-4 flex-1 flex flex-col'>
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
                        className="w-full h-12 mt-2 font-SourceSansPro border border-white002 bg-white001 text-primary011 text-labelbdmb py-2 px-4 rounded"
                    >
                        {receiveProcessing ? 'Claiming...' :'Claim Now'}
                    </button>
                </>)
            }
            {
                giftStatus === 'pending' && (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                        <div className='relativemt-12 flex flex-col items-center mt-12'>
                            <Image alt={'collect-pending'} src={`/svg/collect-gift-processing.svg`} className="rounded mb-8" width={170} height={170}/>
                            <p className=' text-hd2mb font-SourceSanPro text-white001 text-center'>A Magical Surprise Awaits – Will It Be Yours?</p>
                            <p className=' text-labelmb font-SourceSanPro text-white003 text-center mt-8'>🌟 Lucky you! This magical surprise is up for grabs – first come, first served! Are you the fortunate one to claim it? Let’s find out!</p>
                        </div>
                    </div>
                )
            }
            {
                giftStatus === 'notfound' && (
                    <div className='w-full h-full flex flex-col items-center justify-center mt-12'>
                        <div className='relativemt-12 flex flex-col items-center'>
                            <Image alt={'collect-pending'} src={`/svg/fail-collect.svg`} className="rounded mb-8" width={170} height={170}/>
                            <p className=' text-hd2mb font-SourceSanPro text-white001 text-center'>🎈 Oops! Looks like you just missed a surprise!</p>
                            <p className=' text-labelmb font-SourceSanPro text-white003 text-center mt-8'>
                                This gift has already found a new home. But don’t worry, there are plenty more surprises. Keep an eye out for the next magical Gift crafted with Philosopher&#39;s Stone! 🌟
                            </p>
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