"use client"

import useWalletBalance from "@/hooks/useBalance";
import { useConnect } from "@/hooks/useConnect";
import { RootState } from "@/store/store";
import { BI, BIish } from "@ckb-lumos/bi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/_components/Button/Button";
import { EthereumProvider, transfer } from "@/utils/withdraw";
import GuestHome from "@/app/_components/GuestHome/GuestHome";
import { fetchWithdrawAPI } from "@/utils/fetchAPI";
import { enqueueSnackbar } from "notistack";
import { RPC, commons, helpers, Indexer, Transaction} from "@ckb-lumos/lumos";
import { sporeConfig } from "@/utils/config";
import { blockchain } from "@ckb-lumos/base";
import getTransaction from '../../utils/getTransactionStatus';
import { sealTransaction } from "@ckb-lumos/lumos/helpers";
import { bytify, hexify } from "@ckb-lumos/lumos/codec";

const CKB_RPC_URL = sporeConfig.ckbNodeUrl;
const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_RPC_URL);

const Withdraw: React.FC = () => {
    const [toAddress, setToAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>();
    const { lock, address } = useConnect();
    const balance = useWalletBalance(address!!);
    const [amountError, setAmountError] = useState<string>('');

    const calculateFee = (size: number, feeRate: BIish) => {
        const ratio = BI.from(1000);
        const base = BI.from(size).mul(feeRate);
        const fee = base.div(ratio);
        if (fee.mul(ratio).lt(base)) {
            return fee.add(1);
        }
        return BI.from(fee);
    }

    //@ts-ignore
    const ethereum = typeof window !== 'undefined' ? (window.ethereum as EthereumProvider) : undefined;

    const getTransactionSize = (tx: Transaction): number => {
        const serializedTx = blockchain.Transaction.pack(tx);
        return 4 + serializedTx.buffer.byteLength;
    }
    
    const calculateFeeByTransaction = (tx: Transaction, feeRate: BIish) => {
        const size = getTransactionSize(tx);
        return calculateFee(size, feeRate);
    }

    const calculateFeeByTransactionSkeleton = (txSkeleton: helpers.TransactionSkeletonType, feeRate: BIish) => {
        const tx = helpers.createTransactionFromSkeleton(txSkeleton);
        return calculateFeeByTransaction(tx, feeRate);
    }

    const getTransactionfee = async () => {
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        txSkeleton = await commons.common.transfer(
            txSkeleton,
            [address!!],
            toAddress,
            BI.from(amount).mul(BI.from(10).pow(8)).toString(),
        );
    }

    const getMinFeeRate = async (rpc: RPC | string): Promise<BI> => {
        rpc = typeof rpc === 'string' ? new RPC(rpc) : rpc;
        const info = await rpc.txPoolInfo();
        return BI.from(info.minFeeRate);
    }

    const widthDrawFunc = async () => {
        if (!toAddress || !address || !amount) return
        const amountInShannon = BI.from(JSON.stringify(parseInt(amount))).mul(BI.from(10).pow(8));
        // let rlt = await transfer({
        //     amount: amountInShannon.toString(),
        //     from: address,
        //     to: toAddress
        // })
        // if(rlt.errno != 200) {
        //     enqueueSnackbar('withdraw error', {variant: 'error'});
        // } else {
        //     let withdrawResult = await fetchWithdrawAPI({
        //         action: 'withdraw',
        //         key: address,
        //         toAddress,
        //         value: amount,
        //         txHash: rlt.txHash
        //     })
        //     enqueueSnackbar('Withdraw successful', {variant: 'success'});
        // }
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        let tx = await commons.common.transfer(
            txSkeleton,
            [address],
            toAddress,
            amountInShannon.toString()
        );
        let feeRate = await getMinFeeRate(CKB_RPC_URL);
        // let fee = calculateFeeByTransactionSkeleton(tx, feeRate);
        tx = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [address],
            feeRate
        )
        tx = await commons.common.prepareSigningEntries(
            tx
        )
        let signedMessage = await ethereum!!.request({
            method: "personal_sign",
            params: [ethereum!!.selectedAddress, tx.signingEntries.get(0)!!.message],
        });
        let v = Number.parseInt(signedMessage.slice(-2), 16);
        if (v >= 27) v -= 27;
        signedMessage = "0x" + signedMessage.slice(2, -2) + v.toString(16).padStart(2, "0");
        const signedWitness = hexify(
            blockchain.WitnessArgs.pack({
                lock: commons.omnilock.OmnilockWitnessLock.pack({
                    signature: bytify(signedMessage).buffer,
                }),
            })
        );

        tx = tx.update("witnesses", (witnesses) => witnesses.set(0, signedWitness));
        const signedTx = helpers.createTransactionFromSkeleton(tx);
        let txHash = await rpc.sendTransaction(signedTx, "passthrough");
        console.log(txHash);
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

    const changeFeeRate = async() => {
        let rlt = await getMinFeeRate(CKB_RPC_URL);
        console.log(rlt);

    }

    useEffect(() => {
        changeFeeRate();
    }, [])

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