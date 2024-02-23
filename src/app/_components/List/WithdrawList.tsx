import React from "react";
import { WithdrawObj } from '@/types/Withdraw';
import { formatString } from "@/utils/common";
import Withdraw from '../../withdraw/page';
import Link from "next/link";

interface WithdrawListProps {
    WithdrawList: WithdrawObj[];
}

const WithdrawList: React.FC<WithdrawListProps> = ({ WithdrawList }) => {
    return (
        <div className='flex'>
            <div className='flex flex-1 flex-col'>
                <div className="flex text-white001 border-b border-white009 text-white003 py-2">
                    <div className="w-40 font-SourceSanPro text-labelmb px-2 py-1">From</div>
                    <div className="w-40 font-SourceSanPro text-labelmb px-1 py-1">To</div>
                    <div className="w-24 font-SourceSanPro text-labelmb px-1 py-1">Amout</div>
                    <div className="w-12 font-SourceSanPro text-labelmb px-1 py-1"></div>
                </div>
                {
                    WithdrawList?.map((item, index) => {
                        return (
                            <div key={index} className="w-full flex items-center border-b text-white001 border-white009 py-2">
                                <div className="w-40 font-SourceSanPro text-body1mb px-1 py-1">{item.toAddress && formatString(item.toAddress)}</div>
                                <div className="w-40 font-SourceSanPro text-body1mb px-1 py-1">{item.fromAddress && formatString(item.fromAddress)}</div>
                                <div className="w-24 font-SourceSanPro text-body1mb px-1 py-1">{ item.value }</div>
                                <Link href={`${process.env.NODE_ENV === 'development' ? 'https://pudge.explorer.nervos.org': 'https://explorer.nervos.org/'}/transaction/${item.txHash}`} className="flex-1 text-body1mb px-1 px-2 overflow-hidden font-SourceSanPro text-ellipsis text-primary005 whitespace-nowrap">View</Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default WithdrawList