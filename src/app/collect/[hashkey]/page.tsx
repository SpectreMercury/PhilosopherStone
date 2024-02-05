"use client"

import { HashkeyObj, SporeItem } from '@/types/Hashkey';
import { formatDate, formatString } from '@/utils/common';
import { fetchGiftAPI, fetchHashkeyAPI, fetchWalletAPI } from '@/utils/fetchAPI';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getSporeById, transferSpore } from '@spore-sdk/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { config, helpers } from '@ckb-lumos/lumos';
import { router } from '@/server/trpc';
import { getLumosScript } from '@/utils/updateLumosConfig';
import WalletModal from '@/app/_components/WalletModal/WalletModal';
import Image from 'next/image';
import Link from 'next/link';
import { sporeConfig } from '@/utils/config';

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
        const receiverAccounts = walletAddress!!;
        // const sporeCell = await getSporeById(`${sporeId}`, sporeConfig);
        // const senderAddress = await fetchWalletAPI({
        //     action: 'getAddress'
        // })
        // const { txSkeleton, outputIndex } = await transferSpore({
        //     outPoint: sporeCell.outPoint!,
        //     fromInfos: [senderAddress.address!!],
        //     toLock: helpers.parseAddress(receiverAccounts, {
        //         config: sporeConfig.lumos,
        //     }),
        //     config: sporeConfig,
        // });
        const txHash = await fetchWalletAPI({
            action: 'signAndSendTransaction',
            sporeId,
            receiverAccounts
        });
        console.log(txHash);
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
        <div className='universe-bg px-4 flex-1 flex flex-col rounded-3xl'>
            {giftStatus === 'success' && (
                <>
                    {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)}/>}
                    <div className='relative mt-10 w-full flex flex-col items-center py-8 px-4 bg-primary008 rounded-md font-SourceSanPro text-white001'>
                        <Image 
                            className='absolute top-[6px] left-[6px]'
                            src='/svg/bg-fireworks.svg'
                            width={111}
                            height={108}
                            alt='decor'
                        />
                        <Image 
                            className='absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2'
                            src='/svg/avatar-sender.svg'
                            width={48}
                            height={48}
                            alt='sender&apos;s avatar'
                        />
                        <div className='w-full flex justify-center text-body1mb'>
                           From: {sporeInfo ? formatString(sporeInfo?.senderWalletAddress!!): '*****'}
                        </div>
                        <div className='w-full flex justify-center mt-4 text-labelmb text-white003'>
                            { sporeInfo ? new Date(sporeInfo?.date!!).toLocaleDateString() : '*****'}
                        </div>
                        <div className='w-full flex justify-center mt-4'>
                            <img src={`/api/media/${sporeInfo?.sporeId}`} className="px-4 w-[220px] h-[170px]" alt="Gift" /> 
                        </div>
                        <div className='w-full flex justify-center mt-4 items-center'>
                            {giftMessage && <p className="text-body1mb">{giftMessage}</p>}
                        </div>
                        
                    </div>
                    <button 
                        disabled={receiveProcessing}
                        onClick={() => {
                            if(sporeInfo) {
                                receiveGift(sporeInfo.sporeId);
                            }
                        }}
                        className="w-full h-12 mt-8 font-SourceSanPro border border-white002 bg-white001 text-primary011 text-buttonmb py-2 px-4 rounded"
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
                            <p className=' text-hd2mb font-Montserrat text-white001 text-center'>A Magical Surprise Awaits &ndash; Will It Be Yours?</p>
                            <p className=' text-labelmb font-SourceSanPro text-white003 text-center mt-8'>This magical surprise is up for grabs &ndash; first come, first served! Are you the lucky one to claim it? Let&apos;s find out!</p>
                        </div>
                    </div>
                )
            }
            {
                giftStatus === 'notfound' && (
                    <div className='w-full h-full flex flex-col items-center justify-center mt-12'>
                        <div className='relativemt-12 flex flex-col items-center'>
                            <Image alt={'collect-pending'} src={`/svg/fail-collect.svg`} className="rounded mb-8" width={170} height={170}/>
                            <p className=' text-hd2mb font-SourceSanPro text-white001 text-center'>🎈 Uh-oh! Looks like you just missed the surprise.</p>
                            <p className=' text-labelmb font-SourceSanPro text-white003 text-center mt-8'>
                                This gift was claimed by someone else. But don&apos;t worry, there are plenty more surprises. Keep an eye out for the next magical Gift crafted with Philosopher&apos;s Stone! 🌟
                            </p>
                        </div>
                        <Link href={'/'} className='w-full flex items-center justify-center h-12 text-buttonmb font-SourceSanPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded mt-8'>
                            Come Back Later
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default Hashkey