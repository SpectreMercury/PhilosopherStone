"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Button } from "@mantine/core";

const Finished: React.FC = () => {
    const searchParams = useSearchParams();
    const txHash = searchParams.get('tx');
    const type = searchParams.get('type');
    const key = searchParams.get('key');

    const handleCopy = async () => {
        try {
        await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/collect/${key}`);
        enqueueSnackbar('Copied Successful', {variant: 'success'})
        } catch (err) {
        enqueueSnackbar('Copied Fail', {variant: 'error'})
        }
    };
    return (
        <div className="flex-1 flex items-center justify-center flex-col gap-8 px-4">
            {
                type === 'URL' ? 
                (<>
                    <Image 
                        width={170}
                        height={170}
                        alt='gift demo'
                        src={'/svg/link-gift.svg'}
                    />
                    <div className="px-4 text-white001 text-hd2mb font-Montserrat text-center">
                        Your Gift is ready to go!
                    </div>
                    <input 
                        className="w-full py-3 rounded-md border-2 border-white009 bg-primary008 text-white001 px-4"
                        readOnly={true}
                        value={`${window.location.protocol}//${window.location.host}/collect/${key}`}/>
                    <button 
                        onClick={handleCopy}
                        className="w-full h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded flex items-center justify-center"
                    >
                        Copy Link
                    </button>
                    <Link 
                        target="_blank" href={`https://twitter.com/intent/tweet?text=🌠 I just used #PhilosopherStone to create a unique gift just for you! Don’t miss out on this one-of-a-kind surprise. Claim it here: ${`${window.location.protocol}//${window.location.host}/collect/${key}`} 🎁 Feel free to melt it into #CKB if it's not your cup of tea. ✨ #NFT #Gift  #SporeProtocol #Web3`}
                        className="w-full h-12 font-PlayfairDisplay border border-white002 text-white001 py-2 px-4 rounded flex items-center justify-center"
                    >
                        Share on Twitter
                    </Link>
                </>)
                : (<>
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
                        You&lsquo;ve just shared a delightful surprise. You can keep track of your gift on <Link className=" text-primary005" target="_blank" href={`https://explorer.nervos.org/transaction/${txHash}`}>CKB Explorer</Link>. Thank you for spreading joy with Philosopher&apos;s Stone! 🌟
                    </div>
                    <Link 
                        target="_blank" href={`https://explorer.nervos.org/transaction/${txHash}`}
                        className="w-full h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded flex items-center justify-center"
                    >
                        View on Explorer
                    </Link>
                </>)
            }
        </div>
    )
}

export default Finished

