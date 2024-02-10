"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/app/_components/Button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchHashkeyAPI } from '@/utils/fetchAPI';
import { HashkeyGift, HashkeyObj } from '@/types/Hashkey';
import { formatString } from '@/utils/common';
import Link from 'next/link';

const Zhimakaimen: React.FC = () => {
    const [receiveProcessing, setReceiveProcessing] = useState<boolean>(false);
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
    const [hashKey, setHashKey] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [pageStatus, setPageStatus] = useState<'process' | 'successful' | 'fail'>('process');
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [sporeInfo, setSporeInfo] = useState<HashkeyGift>();
    const tweetText = "I just unlocked an exclusive New Year gift with #PhilosopherStone at the event co-hosted by #BuidlerDAO! 🎉 Join the game and claim yours. Don't miss out! 🚀"

    const claimGift = async () => {
        if(!hashKey || !walletAddress) return 
        const txHash = await fetchHashkeyAPI({
            action: 'checkAndGetHashKey',
            key: hashKey,
            receiverAccount: walletAddress
        });
        if (txHash.errno === 404) {
            setErrMsg('Key is Wrong, Try another')
            return 
        }
        if (txHash.errno === 403) {
            setPageStatus('fail'); 
            return
        }
        setSporeInfo(txHash.data);
        setPageStatus('successful');
    }



    return (
        <div className='px-4'>
            {
                pageStatus === 'process' && (
                    <>
                        <div className='w-full flex justify-center mt-8'>
                            <Image src={'/svg/dragon-packet.svg'} width={343} height={170} alt={'dragon-pocket'} />
                        </div>
                        <div className='w-full flex flex-col items-center justify-center mt-8'>
                            <p className='text-white001 font-Montserrat text-hd3mb'>Unlock Your New Year Gift</p>
                            <p className=' text-white003 font-SourceSanPro text-labelmb mt-4'>Enter the key you&#39;ve discovered from the riddles below</p>
                        </div>
                        <div className='w-full flex items-center flex-col justify-center mt-8'>
                            <input 
                                onChange={(e) => {setHashKey(e.target.value)}}
                                className='w-[343px] h-12 border border-white009 rounded-lg bg-primary008 mt-2 px-4 text-white001'
                            />
                            { errMsg && <p className=' text-error-function font-SourceSanPro text-labelmb mt-4'>{errMsg}</p> }
                        </div>
                        <Button
                            type='solid'
                            label={receiveProcessing ? 'Claiming...' : 'Claim Now'}
                            className='!w-[343px] mx-auto mt-8 flex justify-center items-center'
                            onClick={() => {
                                claimGift()
                            }}
                            disabled={receiveProcessing}
                        />
                    </>
                )
            }
            {
                pageStatus === 'fail' && (
                    <>
                        <div className='w-full flex justify-center items-center flex-col mt-8'>
                            <Image alt={'already-claim'} src={'/svg/already-claim.svg'} width={160} height={170}/>
                            <p className='text-white001 font-Montserrat text-hd3mb mt-8'>Already claimed</p>
                            <p className='text-white003 text-labelmb font-SourceSanPro max-w-[343px] text-center mt-8'>
                                Looks like you’ve already claimed a Gift. Let’s give everyone else a chance to shine! ❤️
                            </p>
                            <Button type='solid' className="max-w-[343px] mx-auto flex justify-center items-center mt-8" label='Back to My Gifts' href={'/'} />
                        </div>
                    </>
                )
            }
            {
                pageStatus === 'successful' && (
                    <>
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
                        <p className='text-center text-white001 font-Montserrat text-hd3mb mt-6'>Congratulation!</p>
                        <p className='text-center text-white003 mt-4'>The Gift is yours to enjoy. Please note, it might take some time to appear in your Gifts.</p>
                        <Button type='solid' className="max-w-[343px] mx-auto flex justify-center items-center mt-8" label='Share on Twitter' href={`https://twitter.com/intent/tweet?text=${tweetText}`} />
                        <div className='w-full text-center mt-4'>
                            <Link href={'/'} className='text-linkColor text-center text-body1mb'>Back to My Gifts</Link>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Zhimakaimen;