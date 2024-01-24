"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { predefinedSporeConfigs, meltSpore as _meltSpore } from '@spore-sdk/core';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useSporeQuery } from '@/hooks/useQuery/useQuerybySpore';
import { BI } from '@ckb-lumos/lumos';
import MeltGiftModal from '@/app/_components/MeltModal/MeltModal';
import { useConnect } from '@/hooks/useConnect';
import { sendTransaction } from '@/utils/transaction';
import { useMutation } from '@tanstack/react-query';
import useLoadingOverlay from '@/hooks/useLoadOverlay';
import LoadingOverlay from '@/app/_components/LoadingOverlay/LoadingOverlay';
import { getLumosScript } from '@/utils/updateLumosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const Gift: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  const pathAddress = pathName.split("/")[pathName.split('/').length - 1]
  const ckbOccupied = useSearchParams()
  const { data: spore, isLoading: isSporeLoading } = useSporeQuery(
    pathAddress as string,
  );
  const [occupied, setOccupied] = useState<string>('')
  const [isMeltModal, setIsMeltModal] = useState<boolean>(false)
  const [giftMessage, setGiftMessage] = useState<string>("") 
  const { address, signTransaction } = useConnect()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);

  const { isVisible, showOverlay, hideOverlay, progressStatus, setProgressStatus } = useLoadingOverlay(); 
  const texts = ["Unmatched Flexibility and Interopera­bility", "Supreme Security and Decentrali­zation", "Inventive Tokenomics"]; 

  function formatNumberWithCommas(num: number) {
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
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'remove', key, ids: [value] }),
    });
    const data = await response.json();
    return data;
  }
  

  const getGiftStatus = async () => {
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'checkStatus', key: pathAddress }),
    });
    const data = await response.json();
    setGiftMessage(data.data.giftMessage)
    return data;
  }

  useEffect(() => {
    getGiftStatus()
  }, [])

  useEffect(() => {
    if(!isSporeLoading) {
      formatNumberWithCommas(BI.from(spore?.cell?.cellOutput.capacity).toNumber() / 10 ** 8)
    }
  }, [isSporeLoading, spore?.cell?.cellOutput.capacity])

  return (
    <div className="flex flex-col items-center p-4">
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
      <div className="py-4">
        <img src={`/api/media/${pathAddress}`} width={300} height={200} className="px-4" alt="Gift" />
      </div>
      <div className='text-white001 font-Montserrat text-hd2mb pb-4'>
        {occupied} CKB 
      </div>
      {giftMessage && <p className="pb-4 font-SourceSanPro text-white001 text-body1mb">“{giftMessage}”</p>}
      <Link 
        className="w-full h-12 flex justify-center items-center text-buttonmb font-SourceSansPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" 
        href={`/send?hasGift=${pathAddress}`}
      >
        Send as Gift
      </Link>
      <button 
        className="w-full h-12 text-buttonmb font-SourceSansPro border border-white002 my-4 py-2 px-4 rounded text-white001" 
        onClick={handleMeltModal}
      >
        Melt
      </button>
    </div>
  );
};

export default Gift;
