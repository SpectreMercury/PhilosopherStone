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
import { fetchBlindBoxAPI, fetchGiftAPI, fetchHistoryAPI } from '@/utils/fetchAPI';
import { formatNumberWithCommas } from '@/utils/common';
import { sporeConfig } from '@/utils/config';


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
      await PutIntoProcessList(walletAddress!!, txHash)
      return txHash;
    },
    [signTransaction],
  );

  async function PutIntoProcessList(key: string, id: string) {
    const response = await fetchHistoryAPI({
      action: 'setHistory',
      key,
      record: {
        actions: 'melt',
        status: 'pending',
        sporeId: 'pathAddress',
        from: walletAddress!!,
        id: id
      }
    })
    return response
  }

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
    await meltSporeMutation.mutateAsync({
      outPoint: spore!.cell!.outPoint!,
      config: sporeConfig,
    });
    callUpdateGiftReadStatusAction(walletAddress!!, pathAddress)
    setProgressStatus('done')
    setTimeout(() => {
      hideOverlay();
    }, 1000)
    enqueueSnackbar('Melt Successful', {variant: 'success'})
    router.push('/')
  }

  async function callUpdateGiftReadStatusAction(key: string, value: string) {
    const response = await fetchBlindBoxAPI({ action: 'remove', key, ids: [value] });
    const data = await response.json();
    return data;
  }
  

  const getGiftStatus = async () => {
    const response = await fetchGiftAPI({ action: 'getGiftInfo', key: pathAddress });
    setGiftMessage(response.data?.giftMessage || null);
  }

  useEffect(() => {
    getGiftStatus()
  }, [])

  useEffect(() => {
    if(!isSporeLoading) {
      let occupied = formatNumberWithCommas(BI.from(spore?.cell?.cellOutput.capacity).toNumber() / 10 ** 8)
      setOccupied(occupied);
    }
  }, [isSporeLoading, spore?.cell?.cellOutput.capacity])

  return (
    <div className="universe-bg flex flex-col items-center px-4 pb-12 rounded-3xl">
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
      <div className="mb-6">
        <img src={`/api/media/${pathAddress}`} className='w-[300px] h-[200px]' alt="Gift" />
      </div>
      <div className='text-white001 font-Montserrat text-hd2mb mb-6'>
        {occupied} CKB 
      </div>
      {giftMessage && <p className="pb-4 font-SourceSanPro text-white001 text-body1mb">“{giftMessage}”</p>}
      <Link 
        className="w-full h-12 flex justify-center items-center text-buttonmb font-SourceSanPro border border-white002 bg-white001 text-primary011 mb-4 rounded" 
        href={`/send?hasGift=${pathAddress}`}
      >
        Send as Gift
      </Link>
      <button 
        className="w-full h-12 text-buttonmb font-SourceSanPro border border-white002 rounded text-white001" 
        onClick={handleMeltModal}
      >
        Melt
      </button>
    </div>
  );
};

export default Gift;
