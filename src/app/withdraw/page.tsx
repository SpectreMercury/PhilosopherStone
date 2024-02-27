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
import { Cell, blockchain } from "@ckb-lumos/base";
import getTransaction from '../../utils/getTransactionStatus';
import { sealTransaction } from "@ckb-lumos/lumos/helpers";
import { bytify, hexify } from "@ckb-lumos/lumos/codec";
import { injectCapacityAndPayFee, payFeeByOutput } from "@spore-sdk/core";

const CKB_RPC_URL = sporeConfig.ckbNodeUrl;
const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_RPC_URL);

const Withdraw: React.FC = () => {
    const [toAddress, setToAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>();
    const { lock, address } = useConnect();
    const balance = useWalletBalance(address!!);
    const [amountError, setAmountError] = useState<string>('');
    //@ts-ignore
    const ethereum = typeof window !== 'undefined' ? (window.ethereum as EthereumProvider) : undefined;

    const SECP_SIGNATURE_PLACEHOLDER = hexify(
        new Uint8Array(
            commons.omnilock.OmnilockWitnessLock.pack({
            signature: new Uint8Array(65).buffer,
            }).byteLength
        )
    );

    const getMinFeeRate = async (rpc: RPC | string): Promise<BI> => {
        rpc = typeof rpc === 'string' ? new RPC(rpc) : rpc;
        const info = await rpc.txPoolInfo();
        return BI.from(info.minFeeRate);
    }

    const widthDrawFunc = async () => {
        if (!toAddress || !address || !amount) return
        const amountInShannon = BI.from(JSON.stringify(amount)).mul(BI.from(10).pow(8));
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        const collectedCells: Cell[] = [];
        let collector = indexer.collector({lock: helpers.parseAddress(address), type: 'empty'});
        let collectedSum = BI.from(0);
        for await (const cell of collector.collect()) {
            collectedSum = collectedSum.add(cell.cellOutput.capacity);
            collectedCells.push(cell);
            if (BI.from(collectedSum).gte(amountInShannon)) break;
        }
        const transferOutput: Cell = {
            cellOutput: {
                capacity: BI.from(amountInShannon).toHexString(),
                lock: helpers.parseAddress(toAddress),
            },
            data: "0x",
        };
        
        txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(...collectedCells));
        txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(transferOutput));
        txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
            cellDeps.push(
            {
                outPoint: {
                txHash: sporeConfig.lumos.SCRIPTS.OMNILOCK?.TX_HASH!!, 
                index: sporeConfig.lumos.SCRIPTS.OMNILOCK?.INDEX!!,
                },
                depType: sporeConfig.lumos.SCRIPTS.OMNILOCK?.DEP_TYPE!!,
            },
            {
                outPoint: {
                txHash: sporeConfig.lumos.SCRIPTS.SECP256K1_BLAKE160!!.TX_HASH,
                index: sporeConfig.lumos.SCRIPTS.SECP256K1_BLAKE160!!.INDEX,
                },
                depType: sporeConfig.lumos.SCRIPTS.SECP256K1_BLAKE160!!.DEP_TYPE,
            }
            )
        );

        const witness = hexify(blockchain.WitnessArgs.pack({ lock: SECP_SIGNATURE_PLACEHOLDER }));
        for (let i = 0; i < txSkeleton.inputs.toArray().length; i++) {
            txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.push(witness));
        }

        let payResult = await payFeeByOutput({
            txSkeleton,
            outputIndex: 0,
            config: sporeConfig,
        })

        txSkeleton = await commons.omnilock.prepareSigningEntries(
            payResult,
            {config: sporeConfig.lumos}
        )

        let signedMessage = await ethereum!!.request({
            method: "personal_sign",
            params: [ethereum!!.selectedAddress, txSkeleton.signingEntries.get(0)!!.message],
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

        txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.set(0, signedWitness));

        const signedTx = helpers.createTransactionFromSkeleton(txSkeleton);
        try {
            let txHash = await rpc.sendTransaction(signedTx, "passthrough");
            let withdrawResult = await fetchWithdrawAPI({
                action: 'withdraw',
                key: address,
                toAddress,
                value: amount,
                txHash
            })
            enqueueSnackbar('Withdraw successful', {variant: 'success'});
        } catch {
            enqueueSnackbar('withdraw error', {variant: 'error'});
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

    const changeFeeRate = async() => {
        let rlt = await getMinFeeRate(CKB_RPC_URL);
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
                    type='float'
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