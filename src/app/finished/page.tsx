"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Finished: React.FC = () => {
    const searchParams = useSearchParams();
    const txHash = searchParams.get('tx')
    return (
        <div className="flex-1 flex items-center justify-center flex-col gap-8 px-4">
            <Image 
                width={170}
                height={170}
                alt='gift demo'
                src={'/svg/process-bg.svg'}
            />
            <div className="px-4 text-white001 text-hd2mb font-Montserrat text-center">
                 Great! Your transaction is underway.
            </div>
            <div className="px-4 text-white001 text-center font-SourceSanPro">
                Depending on network traffic, it might take a little time to complete. You can always check the status in your <Link className=" text-primary005" target="_blank" href={`/history`}>Gift History</Link>, or visit the <Link className=" text-primary005" target="_blank" href={`https://explorer.nervos.org/transaction/${txHash}`}>CKB Explorer</Link>. Thank you for spreading joy with Philosopher’s Stone! 🌟
            </div>
            <Link 
                target="_blank" href={`https://explorer.nervos.org/transaction/${txHash}`}
                className="w-full h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded flex items-center justify-center"
            >
                View on Explorer
            </Link>
        </div>
    )
}

export default Finished

