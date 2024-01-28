"use client"
import { useConnect } from '@/hooks/useConnect';
import { RootState } from '@/store/store';
import { HistoryRecord } from '@/types/History';
import { fetchGiftAPI, fetchHashkeyAPI, fetchHistoryAPI } from '@/utils/fetchAPI';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HistoryList from '../_components/List/HistoryList';
import { ReceivedGift } from '@/types/Gifts';

const History: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
    const [activeTab, setActiveTab] = useState<'Action'| 'Received'|'Key'>('Action');
    const [receivedGiftList, setReceivedGiftList] = useState<ReceivedGift[]>([]);
    const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
    const [currentList, setCurrentList] = useState<HistoryRecord[] | ReceivedGift[]>();
     
    const getHistoryList = async (address: string) => {
        let data = await fetchHistoryAPI({
                action: 'getHistory',
                key: address
        })
        setHistoryData(data.data)
    }

    const getReceivedList = async(address: string) => {
        let data = await fetchGiftAPI({
            action: 'getReceivedGifts',
            key: address
        });
        setReceivedGiftList(data.data);
    }

    const getHashkeyList = async(address: string) => {
        let data = await fetchHashkeyAPI({
            action: 'getHashKeyHistory',
            key: address,
        })
        console.log(data);
    }

    useEffect(() => {
        if(activeTab === 'Action') {
            setCurrentList(historyData);
        } else if(activeTab === 'Received') {
            setCurrentList(receivedGiftList);
        }
        
    }, [activeTab, historyData, receivedGiftList])

    useEffect(() => {
        if(walletAddress) {
            getHistoryList(walletAddress);
            getReceivedList(walletAddress);
            getHashkeyList(walletAddress);
        }
    }, [walletAddress])
    return (
        <div className={`flex flex-col flex-1 px-4`}>
            <div className="flex rounded-md bg-primary011 my-8">
                <button
                    className={`flex-1 py-2 m-1 text-white text-buttonmb font-SourceSanPro ${activeTab === 'Action' ? 'bg-primary010' : ''} rounded-md`}
                    onClick={() => {
                        setActiveTab('Action')
                    }}
                >
                    Action
                </button>
                <button
                className={`flex-1 py-1 m-1 text-white text-buttonmb font-SourceSanPro ${activeTab === 'Received' ? 'text-blue-500 bg-primary010' : ''} rounded-md `}
                onClick={() => {
                    setActiveTab('Received')
                }}
                >
                    Received
                </button>
                <button
                className={`flex-1 py-1 m-1 text-white text-buttonmb font-SourceSanPro ${activeTab === 'Key' ? 'text-blue-500 bg-primary010' : ''} rounded-md `}
                onClick={() => {
                    setActiveTab('Key')
                }}
                >
                    Key
                </button>
            </div>
            {
                currentList?.length ? 
                (<>
                    {activeTab === 'Action' && <HistoryList ListType={activeTab} HistoryList={historyData} />}
                    {activeTab === 'Received' && <HistoryList ListType={activeTab} ReceivedList={receivedGiftList} />}
                </>)
                    :
                (
                    <div className="flex-1 flex justify-center items-center">
                        <div className='px-4 items-center'>
                            <p className='text-white font-Montserrat text-hd2mb mb-8'>No action history Now</p>
                            <Link className="flex-1 flex items-center justify-center h-12 mb-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" href={'/'}>Create a Gift</Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default History