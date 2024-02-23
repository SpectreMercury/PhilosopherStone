"use client"

import useWalletBalance from "@/hooks/useBalance";
import { useConnect } from "@/hooks/useConnect";
import { RootState } from "@/store/store";
import { BI } from "@ckb-lumos/bi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/_components/Button/Button";
import { transfer } from "@/utils/withdraw";
import GuestHome from "@/app/_components/GuestHome/GuestHome";
import { fetchWithdrawAPI } from "@/utils/fetchAPI";
import { enqueueSnackbar } from "notistack";

const Withdraw: React.FC = () => {
    const [toAddress, setToAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>();
    const { lock, address } = useConnect();
    const balance = useWalletBalance(address!!);
    const [amountError, setAmountError] = useState<string>('');

    const widthDrawFunc = async () => {
        if (!toAddress || !address || !amount) return
        const amountInShannon = BI.from(parseInt(amount) - 1).mul(BI.from(10).pow(8));
        let rlt = await transfer({
            amount: amountInShannon.toString(),
            from: address,
            to: toAddress
        })
        if(rlt.errno != 200) {
            enqueueSnackbar('withdraw error', {variant: 'error'});
        } else {
            let withdrawResult = await fetchWithdrawAPI({
                action: 'withdraw',
                key: address,
                toAddress,
                value: amount,
                txHash: rlt.txHash
            })
            enqueueSnackbar('Withdraw successful', {variant: 'success'});
        }
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amt = e.target.value;
        setAmount(amt);
        if (parseFloat(amt) <= 0 || parseFloat(amt) > balance) {
            setAmountError(`Please enter a number between 1 and ${balance}`)
        } else {
            setAmountError('')
        }
    }

    return (
        <>
        {!address ? <GuestHome /> : 
        <div className='universe-bg px-4 flex-1 flex flex-col rounded-3xl'>
            <p className="font-Montserrat text-hd3mb text-white001 text-center mt-8">Withdraw</p>
            <p className="font-SourceSanPro text-body1mb text-white003 mt-4">Easily transfer your balance to any EVM compatible wallet address. Enter the destination address and the amount you wish to withdraw.</p>
            <div className='flex flex-col'>
                <p className='text-white001 font-SourceSanPro text-labelmb mt-6'>Send to</p>
                <input 
                    id="walletAddress"
                    autoFocus
                    placeholder='E.g. 0xAbCdEfGhIjKlMnOpQrStUvWxYz0123456789'
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className='w-full h-12 border border-white009 rounded-lg bg-primary008 mt-2 px-4 text-white001' />
            </div>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center mt-6'>
                    <p className='text-white001 font-SourceSanPro text-labelmb'>Amount</p>
                    <p className='cursor-pointer text-linkColor font-SourceSanPro text-labelmb' onClick={() => setAmount(balance.toString())}>{`Max: ${balance} CKB`}</p>
                </div>
                <input 
                    id="capacity"
                    type='number'
                    value={amount}
                    onChange={handleAmountChange}
                    className='w-full h-12 border border-white009 rounded-lg bg-primary008 mt-2 px-4 text-white001' />
                {amountError && <span className='font-SourceSanPro text-light-error-function text-labelmb mt-1'>{amountError}</span>}
            </div>
            <div className='flex flex-col my-8'>
                <Button 
                    type='solid' 
                    label='Withdraw' 
                    onClick={widthDrawFunc}
                    disabled={!amount || !toAddress || !!amountError}
                />
            </div>
        </div>
        }</>
    )
}

export default Withdraw