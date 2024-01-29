import { ReceivedGift } from '@/types/Gifts';
import { HistoryRecord } from '@/types/History';
import { formatString } from '@/utils/common';
import Link from 'next/link';
import React, { useState } from 'react';

interface HistoryListProps {
    HistoryList?: HistoryRecord[];
    ReceivedList?: ReceivedGift[];
    ListType: 'Action' | 'Received'
}

const HistoryList: React.FC<HistoryListProps> = ({ListType, HistoryList, ReceivedList}) => {
    return (
        <div className='flex'>
            {ListType === 'Action' ? 
                (
                    <div className='flex flex-1 flex-col'>
                        <div className="flex mb-2 text-white001 border-b border-gray-200 py-2">
                            <div className="flex-1 font-SourceSanPro text-body1mb px-2 py-1">Transaction #</div>
                            <div className="w-16 font-SourceSanPro text-body1mb px-1 py-1">Action</div>
                            <div className="w-24 font-SourceSanPro text-body1mb px-1 py-1">Date</div>
                            <div className="w-12 font-SourceSanPro text-body1mb px-1 py-1"></div>
                        </div>
                        {
                            HistoryList?.map((item, index) => (
                                <div key={index} className="w-full flex items-center border-b text-white001 border-gray-200 py-2">
                                    <div className="flex-1 text-body1mb px-2 overflow-hidden font-SourceSanPro text-ellipsis whitespace-nowrap">{formatString(item.id)}</div>
                                    <div className="w-16 font-SourceSanPro text-body1mb px-1">{item.actions}</div>
                                    <div className="w-24 font-SourceSanPro text-body1mb px-1">{new Date(item.date).toLocaleDateString()}</div>
                                    <Link href={`/receipt/${item.id}?date=${item.date}&type=${item.actions}`} className="w-12 font-SourceSanPro text-body1mb px-1 text-primary005">View</Link>
                                </div>
                            ))
                        }
                    </div>
                    
                )
                :
                (<>
                    <div className='flex flex-1 flex-col'>
                        <div className="flex mb-2 text-white001 border-b border-gray-200 py-2">
                            <div className="flex-1 font-SourceSanPro text-body1mb px-2 py-1">Transaction #</div>
                            <div className="w-24 font-SourceSanPro text-body1mb px-1 py-1">Date</div>
                            <div className="w-12 font-SourceSanPro text-body1mb px-1 py-1"></div>
                        </div>
                        {
                            ReceivedList?.map((item, index) => (
                                <div key={index} className="w-full flex items-center border-b text-white001 border-gray-200 py-2">
                                    <div className="flex-1 text-body1mb px-2 overflow-hidden font-SourceSanPro text-ellipsis whitespace-nowrap">{formatString(item.id)}</div>
                                    <div className="w-24 font-SourceSanPro text-body1mb px-1">{new Date(item.date).toLocaleDateString()}</div>
                                    <Link href={`/gift/${item.id}`} className="w-12 font-SourceSanPro text-body1mb px-1 text-primary005">View</Link>
                                </div>
                            ))
                        }
                    </div>
                </>)}

        </div>
    )
}

export default HistoryList