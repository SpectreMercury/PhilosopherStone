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
import { HashkeyObj } from '@/types/Hashkey';
import HashkeyList from '@/app/_components/List/HashkeyList';

const History: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
    const [activeTab, setActiveTab] = useState<'Action'| 'Received'|'Key'>('Action');
    const [receivedGiftList, setReceivedGiftList] = useState<ReceivedGift[]>([]);
    const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
    const [currentList, setCurrentList] = useState<HistoryRecord[] | ReceivedGift[] | HashkeyObj[]>();
    const [hashkeyList, setHashkeyList] = useState<HashkeyObj[]>([]) 
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
        setHashkeyList(data.data);
    }

    useEffect(() => {
        if(activeTab === 'Action') {
            setCurrentList(historyData);
        } else if(activeTab === 'Received') {
            setCurrentList(receivedGiftList);
        } else {
            setCurrentList(hashkeyList);
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
            <h3 className='font-Montserrat text-hd3mb text-white001 mt-8 mb-4 text-center'>Gift History</h3>
            <div className="flex rounded-md bg-primary011">
                <button
                    className={`flex-1 py-2 m-1 font-SourceSanPro ${activeTab === 'Action' ? 'bg-primary010 text-white001 text-labelbdmb' : 'text-labelmb text-white005'} rounded-md`}
                    onClick={() => {
                        setActiveTab('Action')
                    }}
                >
                    Action
                </button>
                <button
                className={`flex-1 py-1 m-1 font-SourceSanPro ${activeTab === 'Received' ? 'bg-primary010 text-white001 text-labelbdmb' : 'text-labelmb text-white005'} rounded-md `}
                onClick={() => {
                    setActiveTab('Received')
                }}
                >
                    Received
                </button>
                <button
                className={`flex-1 py-1 m-1 font-SourceSanPro ${activeTab === 'Key' ? 'bg-primary010 text-white001 text-labelbdmb ' : 'text-labelmb text-white005'} rounded-md `}
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
                    {activeTab === 'Key' && <HashkeyList HashkeyList={hashkeyList} />}
                </>)
                    :
                (
                    <div className="flex-1 flex justify-center items-center">
                        <div className='px-4 items-center'>
                            <p className='text-white font-Montserrat text-hd2mb mb-8'>No history now</p>
                            <Link className="flex-1 flex items-center justify-center h-12 mb-8 font-SourceSanPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" href={'/'}>Create Gift</Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default History