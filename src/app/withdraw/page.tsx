"use client"

import useWalletBalance from "@/hooks/useBalance";
import { useConnect } from "@/hooks/useConnect";
import { RootState } from "@/store/store";
import { BI } from "@ckb-lumos/bi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/_components/Button/Button";
import { transfer } from "@/utils/withdraw";

const Withdraw: React.FC = () => {
    const [toAddress, setToAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>();
    const { lock, address } = useConnect();
    const balance = useWalletBalance(address!!);

    const widthDrawFunc = async () => {
        if (!toAddress || !address || !amount) return
        const amountInShannon = BI.from(amount).mul(BI.from(10).pow(8));
        transfer({
            amount: amountInShannon.toString(),
            from: address,
            to: toAddress
        }).then(res => {
            console.log(res);
        })
    }

    return (
        <div>
            <p className=" font-Montserrat text-hd1mb text-white001 text-center mt-12">Withdraw</p>
            <div className='flex flex-col px-4'>
                <p className='text-white001 font-SourceSanPro text-body1bdmb mt-4'>Recipient’s wallet address*</p>
                <input 
                    id="walletAddress"
                    placeholder='E.g. 0xAbCdEfGhIjKlMnOpQrStUvWxYz0123456789'
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className='w-full h-12 border border-white009 rounded-lg bg-primary008 mt-2 px-4 text-white001' />
            </div>
            <div className='flex flex-col px-4'>
                <p className='text-white001 font-SourceSanPro text-body1bdmb mt-4'>Capacity</p>
                <input 
                    id="capacity"
                    placeholder={`max: ${balance - 1000 } CKB`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='w-full h-12 border border-white009 rounded-lg bg-primary008 mt-2 px-4 text-white001' />
            </div>
            <div className='flex flex-col px-4'>
                <Button 
                    type='solid' 
                    label='Withdraw' 
                    onClick={widthDrawFunc}
                    className='px-4 my-8'
                />
            </div>
        </div>
    )
}

export default Withdraw