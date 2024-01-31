"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { transferSpore as _transferSpore, predefinedSporeConfigs } from '@spore-sdk/core';
import { QuerySpore } from '@/hooks/useQuery/type';
import { useSporeQuery } from '@/hooks/useQuery/useQuerybySpore';
import { BI, OutPoint, config, helpers } from '@ckb-lumos/lumos';
import { fetchBlindBoxAPI, fetchGiftAPI, fetchHashkeyAPI, fetchHistoryAPI } from '@/utils/fetchAPI';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { boxData } from '@/types/BlindBox';
import Image from 'next/image'
import useLoadingOverlay from '@/hooks/useLoadOverlay';
import LoadingOverlay from '../_components/LoadingOverlay/LoadingOverlay';
import { useConnect } from '@/hooks/useConnect';
import { sendTransaction } from '@/utils/transaction';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import { getLumosScript } from '@/utils/updateLumosConfig';
import { GiftProps } from '@/types/Gifts';
import { values } from 'lodash';
import { HashkeyObj, SporeItem } from '@/types/Hashkey';
import { GenerateHashKey } from '@/utils/common';
import { getAccounts } from '@/utils/transferSporeWithAgent';

const SendGift: React.FC = () => {
  const router = useRouter();
  const { signTransaction } = useConnect();
  const { isVisible, showOverlay, hideOverlay, progressStatus, setProgressStatus } = useLoadingOverlay();  
  const texts = ["Unmatched Flexibility and Interopera­bility", "Supreme Security and Decentrali­zation", "Inventive Tokenomics"]; 
  const [message, setMessage] = useState<string>('');
  const [toWalletAddress, setToWalletAddress] = useState<string>('');
  const [hasGift, setHasGift] = useState<string>();
  const [occupied, setOccupied] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'Wallet Address' | 'URL'>('Wallet Address');
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const { refresh: refreshSporesByAddress } = useSporesByAddressQuery(walletAddress, false);
  const { data: spore, isLoading: isSporeLoading } = useSporeQuery(
    hasGift as string,
  );
  const searchParams = useSearchParams();
  const type = searchParams.get('type')

  const getBlindBox = async (boxName: string) => {
    const data = await fetchBlindBoxAPI({
      action: 'getBoxByName',
      key: walletAddress!!,
      name: boxName
    })
    return data.box.boxData
  }

  const _getRandomIndex = (length: number) => {
    return Math.floor(Math.random() * length)
  }

  const _randomExtractGift = async () => {
    if(type !== 'BlindBox') return
    const boxName = searchParams.get('name')
    if(!boxName) return 
    let selectedBlindBox = await getBlindBox(boxName)
    let randomSelect = selectedBlindBox[_getRandomIndex(selectedBlindBox.length)]
    if(!randomSelect) return 
    setHasGift(randomSelect.id)
  }

  const formatNumberWithCommas = (num: number) => {
    const numStr = num.toString();
    const reversedNumStr = numStr.split('').reverse().join('');
    const commaInserted = reversedNumStr.replace(/(\d{3})(?=\d)/g, '$1,');
    setOccupied(commaInserted.split('').reverse().join(''))
  }

  useEffect(() => {
    if(walletAddress) {
      _randomExtractGift()
    }
  }, [walletAddress])

  useEffect(() => {
    if(type !== 'BlindBox') {
      const hasGiftValue = searchParams.get('hasGift');
      setHasGift(hasGiftValue ?? '');
    }
  }, [searchParams])

  const transferSpore = useCallback(
    async (...args: Parameters<typeof _transferSpore>) => {
      const { txSkeleton, outputIndex } = await _transferSpore(...args);
      //@ts-ignore
      const signedTx = await signTransaction(txSkeleton);
      console.log(signedTx);
      const txHash = await sendTransaction(signedTx);
      return {
        txHash,
        index: BI.from(outputIndex).toHexString(),
      } as OutPoint;
    },
    [signTransaction],
  );

  const transferSporeMutation = useMutation({
    mutationFn: transferSpore,
    onSuccess: () => {
    },
    onError: (error) => {
      enqueueSnackbar('Gift Send Failed', { variant: 'error' })
    }
  });
  
  const callSaveAction = async (key: string, id: string, value: GiftProps) => {
    const response = await fetchGiftAPI({ action: 'save', key, id, value });
    return response.data;
  }

  const saveHashKey = async (key: string, record: SporeItem) => {
    const response = await fetchHashkeyAPI({action: 'saveHashkey', key, record})
  }
  
  async function PutIntoProcessList(key: string, id: string, to: string, giftId: string) {
    const response = await fetchHistoryAPI({
      action: 'setHistory',
      key,
      record: {
        actions: 'send',
        status: 'pending',
        sporeId: giftId,
        from: walletAddress!!,
        to: to,
        id: id
      }
    })
    return response
  }

  const handleSubmit = useCallback(
    async (values: { to: string }) => {
      showOverlay(); 
      const accounts = await getAccounts();
      //update lumos setting 
      const latestLumosScript = await getLumosScript();
      let latest = JSON.parse(JSON.stringify(predefinedSporeConfigs.Aggron4))
      latest['lumos'] = latestLumosScript
      if (!walletAddress || (!values.to && activeTab === 'Wallet Address') || !spore) {
        return;
      }
      //update wallet address by activeTab
      let toAddress = activeTab === 'Wallet Address' ? values.to : accounts.AGENT.address;
      let rlt = await transferSporeMutation.mutateAsync({
        outPoint: spore.cell?.outPoint!,
        fromInfos: [walletAddress!!],
        toLock: helpers.parseAddress(toAddress, {
          config: config.predefined.AGGRON4,
        }),
        config: latest,
        useCapacityMarginAsFee: true,
      });
      await saveHashKey(GenerateHashKey(spore.id), {sporeId: spore.id, senderWalletAddress: walletAddress!!, txHash: rlt.txHash })
      await PutIntoProcessList(walletAddress!!, rlt.txHash, toAddress, spore.id);
      await callSaveAction(toAddress, spore.id, {
        'giftMessage': message
      })

      setProgressStatus('done')
      enqueueSnackbar('Gift Send Successful', { variant: 'success' });
      refreshSporesByAddress()
      router.push(`/finished?tx=${rlt.txHash}`);
    },
    [transferSporeMutation],
  );


  useEffect(() => {
    if(!isSporeLoading) {
      formatNumberWithCommas(BI.from(spore?.cell?.cellOutput.capacity).toNumber() / 10 ** 8)
    }
  }, [isSporeLoading, spore?.cell?.cellOutput.capacity])

  return (
    <div className="container mx-auto">
      <LoadingOverlay isVisible={isVisible} texts={texts} progressStatus={progressStatus}/>
      <div>
        <div className='flex justify-center mt-4 flex-col items-center'>
          {
            type === 'BlindBox' ? (
            <>
              {
                isSporeLoading ? (
                  <Image 
                    src={'/svg/blindbox-animation-1.svg'}
                    className='animate-wiggle'
                    width={164}
                    height={120}
                    alt={'unkown-animation'}
                  />
                ) :(<Image 
                    src={'/svg/blindbox-animation-2.svg'}
                    width={164}
                    height={120}
                    alt={'unkown-animation'}
                  />)
              }
            </>) : (
            <>
              {/* @ts-ignore */}
              <img src={`/api/media/${hasGift}`} width={300} height={200} className="px-4" alt="Gift" />
            </>)
          }
          <p className='text-white001 font-SourceSanPro text-hd2mb mt-4'>{type === 'BlindBox' ?  `******`: `${occupied}` } CKBytes</p>
          <p className='text-white001 font-SourceSanPro text-body1mb text-white005 mt-4'>
           {type === 'BlindBox' ? `************` : `${hasGift?.slice(0,10)}......${hasGift?.slice(hasGift.length - 10, hasGift.length)}` }</p>
        </div>
        <div className='flex flex-col px-4'>
          <p className='text-white001 font-SourceSanPro text-body1bdmb mt-4'>Gift Message</p>
          <textarea 
            id="message"
            value={message}
            className='w-full h-24 border rounded-lg bg-primary008 mt-2 px-4 py-2 text-white001' 
            onChange={(e) => setMessage(e.target.value)}/>
        </div>
        <div className='flex flex-col px-4'>
            <p className='text-white001 font-SourceSanPro text-body1bdmb mt-4'>Delivery method</p>
            <div className="flex rounded-md bg-primary011 p-1">
              <button
                className={`flex-1 py-3 text-white text-buttonmb font-SourceSanPro ${activeTab === 'Wallet Address' ? 'bg-primary010' : ''} rounded-md`}
                onClick={() => setActiveTab('Wallet Address')}
              >
                Wallet Address
              </button>
              <button
                className={`flex-1 py-3 text-white text-buttonmb font-SourceSanPro ${activeTab === 'URL' ? 'text-blue-500 bg-primary010' : ''} rounded-md `}
                onClick={() => {
                  setActiveTab('URL')
                }}
              >
                URL
              </button>
            </div>
          </div>
        <div className='flex flex-col px-4'>
            <p className='text-white001 font-SourceSanPro text-body1bdmb mt-4'>Recipient’s wallet address*</p>
            <input 
                id="walletAddress"
                placeholder='E.g. 0xAbCdEfGhIjKlMnOpQrStUvWxYz0123456789'
                value={(activeTab === 'URL' && hasGift) ? GenerateHashKey(hasGift) : toWalletAddress}
                onChange={(e) => setToWalletAddress(e.target.value)}
                readOnly={activeTab === 'URL'}
                className='w-full h-12 border rounded-lg bg-primary008 mt-2 px-4 text-white001' />
        </div>
        <div className='flex flex-col px-4 my-8'>
          <button 
            onClick={() => {handleSubmit({to: toWalletAddress || GenerateHashKey(hasGift!!)})}}
            disabled={!toWalletAddress}
            className={`w-full h-12 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded flex items-center justify-center
              ${activeTab === 'Wallet Address' && !toWalletAddress && 'opacity-50 cursor-not-allowed'} `}
          >
            Send Now
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SendGift;
