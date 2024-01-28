import { ReceivedGift } from '@/types/Gifts';
import { HashkeyObj } from '@/types/Hashkey';
import { HistoryRecord } from '@/types/History';
import { formatString } from '@/utils/common';
import Link from 'next/link';
import React, { useState } from 'react';

interface HistoryListProps {
    HashkeyList: HashkeyObj[];
}

const HistoryList: React.FC<HistoryListProps> = ({ HashkeyList }) => {
    return (
        <div className='flex'>
            <div className='flex flex-1 flex-col'>
                <div className="flex mb-2 text-white001 border-b border-gray-200 py-2">
                    <div className="flex-1 font-SourceSanPro text-body1mb px-2 py-1">Transaction #</div>
                    <div className="w-16 font-SourceSanPro text-body1mb px-1 py-1">Action</div>
                    <div className="w-24 font-SourceSanPro text-body1mb px-1 py-1">Date</div>
                    <div className="w-12 font-SourceSanPro text-body1mb px-1 py-1"></div>
                </div>
                {
                    HashkeyList?.map((item, index) => (
                        <div key={index} className="w-full flex items-center border-b text-white001 border-gray-200 py-2">
                            <div className="flex-1 text-body1mb px-2 overflow-hidden font-SourceSanPro text-ellipsis whitespace-nowrap">{formatString('1')}</div>
                            <div className="w-16 font-SourceSanPro text-body1mb px-1">{item.txHash}</div>
                            <Link href={`/receipt/${item.sporeId}`} className="w-12 font-SourceSanPro text-body1mb px-1 text-primary005">View</Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HistoryList