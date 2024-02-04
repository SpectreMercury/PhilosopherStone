"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { predefinedSporeConfigs, meltSpore as _meltSpore } from '@spore-sdk/core';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useSporeQuery } from '@/hooks/useQuery/useQuerybySpore';
import { BI, RPC } from '@ckb-lumos/lumos';
import MeltGiftModal from '@/app/_components/MeltModal/MeltModal';
import { useConnect } from '@/hooks/useConnect';
import { sendTransaction } from '@/utils/transaction';
import { useMutation } from '@tanstack/react-query';
import useLoadingOverlay from '@/hooks/useLoadOverlay';
import LoadingOverlay from '@/app/_components/LoadingOverlay/LoadingOverlay';
import { getLumosScript } from '@/utils/updateLumosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchGiftAPI } from '@/utils/fetchAPI';
import { formatDate } from '@/utils/common';


const Receipt: React.FC = () => {
  const rpc = new RPC(predefinedSporeConfigs.Aggron4.ckbNodeUrl);
  const router = useRouter();
  const pathName = usePathname();
  const pathAddress = pathName.split("/")[pathName.split('/').length - 1]
  const searchParams = useSearchParams()
  const [transactionStatus, setTransactionStatus] = useState<string>('commited'); 
  const [occupied, setOccupied] = useState<string>('')
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isMeltModal, setIsMeltModal] = useState<boolean>(false)
  const [giftMessage, setGiftMessage] = useState<string>("") 
  const { address, signTransaction } = useConnect()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const [sporeId, setSporeId] = useState<string>('');
  const [historyType, setHistoryType] = useState<string>('melt');
  const [historyDate, setHistoryDate] = useState<string>('');
  const { isVisible, showOverlay, hideOverlay, progressStatus, setProgressStatus } = useLoadingOverlay(); 
  const texts = ["Unmatched Flexibility and Interopera­bility", "Supreme Security and Decentrali­zation", "Inventive Tokenomics"]; 
  const { data: spore, isLoading: isSporeLoading } = useSporeQuery(
    sporeId as string,
  ); 

  const formatNumberWithCommas = (num: number) => {
    const numStr = num.toString();
    const reversedNumStr = numStr.split('').reverse().join('');
    const commaInserted = reversedNumStr.replace(/(\d{3})(?=\d)/g, '$1,');
    setOccupied(commaInserted.split('').reverse().join(''))
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };

  const handleMeltModal = () => {
    setIsMeltModal(!isMeltModal)
  }

  const meltSpore = useCallback(
    async (...args: Parameters<typeof _meltSpore>) => {
      const { txSkeleton } = await _meltSpore(...args);
      const signedTx = await signTransaction(txSkeleton);
      const txHash = await sendTransaction(signedTx);
      return txHash;
    },
    [signTransaction],
  );

  const meltSporeMutation = useMutation({
    mutationFn: meltSpore,
    onSuccess: () => {
      enqueueSnackbar('Melt Successful', {variant: 'success'})
    },
  });

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleClick = () => {
    setShowPopup(!showPopup);
  };

  const handleMelt = async () => {
    if (!address || !spore) {
      return;
    }
    handleMeltModal()
    showOverlay(); 
    const latestLumosScript = await getLumosScript();
    let latest = JSON.parse(JSON.stringify(predefinedSporeConfigs.Aggron4))
    latest['lumos'] = latestLumosScript
    await meltSporeMutation.mutateAsync({
      outPoint: spore!.cell!.outPoint!,
      config: latest,
    });
    await callUpdateGiftReadStatusAction(walletAddress!!, pathAddress)
    setProgressStatus('done')
    setTimeout(() => {
      hideOverlay();
    }, 1000)
    enqueueSnackbar('Melt Successful', {variant: 'success'})
    router.push('/')
  }

  async function callUpdateGiftReadStatusAction(key: string, value: string) {
    const response = await fetchGiftAPI({ action: 'remove', key, ids: [value] })
    const data = await response.data;
    return data;
  }

  const getTransaction = async () => {
    const transaction = await rpc.getTransaction(pathAddress);
    setTransactionStatus(transaction.txStatus.status);
    setSporeId(transaction.transaction.outputs[0].type?.args!!)
  }

  useEffect(() => {
    // getGiftStatus()
  }, [])

  useEffect(() => {
    getTransaction()  
  }, [])

  useEffect(() => {
    let type = searchParams.get('type');
    let date = searchParams.get('date');
    setHistoryType(type || 'create');
    date ? setHistoryDate(formatDate(date)): '';
  }, [searchParams])



  useEffect(() => {
    if(!isSporeLoading && sporeId) {
      formatNumberWithCommas(BI.from(spore?.cell?.cellOutput.capacity).toNumber() / 10 ** 8)
    }
  }, [isSporeLoading, spore?.cell?.cellOutput.capacity, sporeId])

  return (
    <div className="flex flex-col items-center p-4 pb-12">
      <LoadingOverlay isVisible={isVisible} texts={texts} progressStatus={progressStatus}/>
      <MeltGiftModal onClose={handleMeltModal} amount={occupied} onMelt={handleMelt} isOpen={isMeltModal}/>
      <div className='w-full flex justify-between my-8'>
        <div className='flex items-center'>
          <button onClick={() => router.back()} className="self-start">
            <Image
              src='/svg/icon-arrow-left.svg'
              width={24}
              height={24}
              alt='Go back'
            />
          </button>
          <div className='text-white001 font-SourceSanPro text-subheadermb ml-3'>
            {pathAddress.slice(0,6)}...{pathAddress.slice(pathAddress.length - 6, pathAddress.length)}
          </div>
        </div>
        <div className='flex gap-2'>
          <button onClick={() => {handleCopy(pathAddress)}} className="mr-4">
            <Image
              src='/svg/icon-copy.svg'
              width={24}
              height={24}
              alt='Copy address'
            />
          </button>
          <Link href={`https://pudge.explorer.nervos.org/transaction/${spore?.cell?.outPoint?.txHash}`} target='_blank'>
            <Image
              src='/svg/icon-globe.svg'
              width={24}
              height={24}
              alt='Check on CKB Explorer'
            />
          </Link>
        </div>
      </div>
      {
        transactionStatus === 'pending' && 
        <div className='w-full relative flex items-center justify-between bg-warning-bg rounded-md text-warning-function px-4 border border-warning-function font-SourceSanPro text-labelmb py-2'>
          <p>Pending: This Gift is currently being processed.</p>
          <Image 
            className='cursor' 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            onClick={handleClick}
            src={'/svg/question-warning.svg'} 
            width={18} height={18} 
            alt={'explanation-pending'} 
          />
          {showPopup && (
            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-primary008 text-white001 shadow-lg rounded-md z-10">
              <p className='font-SourceSanPro text-labelbdmb'>Hang Tight! Here’s Why It&apos;s Taking Awhile:</p>
              <p className='font-SourceSanPro text-labelbd'>Sometimes, the blockchain gets really busy, kind of like traffic during rush hour. This can make things a bit slower. We&apos;re keeping an eye on it to get your transaction through as soon as possible. Thanks for sticking with us!</p>
            </div>
          )}
        </div>
      }
      {
        transactionStatus === 'commited' && 
        <div className='w-full relative flex items-center justify-between bg-success-bg rounded-md text-success-function px-4 border border-success-function font-SourceSanPro text-labelmb py-2'>
          <p>Pending: This Gift is currently being processed.</p>
        </div>
      }
      <div className="py-4 relative">
        {historyType === 'melt' ? 
        (<>
          <Image
            src={'/svg/melt-404.svg'}
            width={170}
            height={170}
            alt={'melt so 404'}
          />
        </>)
          :
        (<>{sporeId ? 
          <img src={`/api/media/${sporeId}`} width={300} height={200} className="px-4" alt="Gift" /> 
            :
          <Image alt={'unkown-sporeId'} src={`/svg/blindbox-animation-1.svg`} className="rounded" width={164} height={120}/>
        }</>)}
      </div>
      <div className='text-white001 font-Montserrat text-hd2mb'>
        {occupied} CKB 
      </div>
      <div className='font-SourceSanPro text-body1mb py-4 text-white005'>{ historyDate }</div>
      {giftMessage && <p className="pb-4 font-SourceSanPro text-white001 text-body1m">“{giftMessage}”</p>}
      {
        transactionStatus === 'commited' && 
        <>
          <Link 
            className="w-full h-12 flex justify-center items-center text-buttonmb font-SourceSansPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" 
            href={`/send?hasGift=${sporeId}`}
          >
            Send as Gift
          </Link>
          <button 
            className="w-full h-12 text-buttonmb font-SourceSansPro border border-white002 my-4 py-2 px-4 rounded text-white001" 
            onClick={handleMeltModal}
          >
            Melt
          </button>
        </>
      }
    </div>
  );
};

export default Receipt;
