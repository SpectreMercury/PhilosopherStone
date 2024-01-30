"use client"

import { setNewGifts } from '@/store/newGiftsSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

const NewGifts: React.FC = () => {
    const [gifts, setGifts] = useState<string[]>([''])
    const dispatch = useDispatch()
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address)

    

    const getGiftStatus = async () => {
        const response = await fetch('/api/gift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'checkStatus', key: walletAddress }),
        });
        const data = await response.json();
        setGifts(data.data)
        dispatch(setNewGifts(data.data));
        clearGiftStatus()
        return data;
    }

    const clearGiftStatus = async () => {
        const response = await fetch('/api/gift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'clear', key: walletAddress, value: [] }),
        });
        const data = await response.json();
    }

    useEffect(() => {
        getGiftStatus()
    }, [])

    return (
        <div className='h-full flex flex-col justify-center items-center'>
            <div className='text-white001 font-Montserrat text-hd1mb mt-8'>New Gifts</div>
            <div className='mt-8 w-full px-2'>
                <div className='border-t border-white005 flex justify-around py-2'>
                    <div className='text-white001 text-labelmb font-SourceSanPro flex-grow-3 basis-3/4 text-center'>#Transaction</div>
                    <div className='text-white001 text-labelmb font-SourceSanPro flex-grow basis-1/4'>Action</div>
                </div>
                {gifts.map((gift, index) => (
                    <div key={index} className='border-t border-white005 flex justify-around py-2 items-center'>
                        <div className='text-white001 text-body1bdmb flex-grow-3 basis-3/4 flex items-center'>
                            <img src={`/api/media/${gift}`} width={80} height={64} className="px-4" alt="Gift" />
                            <div>{gift.slice(0,10)}...{gift.slice(gift.length - 10, gift.length)}</div>
                        </div>
                        <Link href={`/gift/${gift}`} className='text-body1mb font-SourceSanPro flex-grow basis-1/4 text-primary005'>View</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewGifts