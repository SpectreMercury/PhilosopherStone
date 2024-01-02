"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { predefinedSporeConfigs, meltSpore as _meltSpore } from '@spore-sdk/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';
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
  const { address, signTransaction } = useConnect()
  const { isVisible, showOverlay, hideOverlay } = useLoadingOverlay();
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
    showOverlay(); 
    await meltSporeMutation.mutateAsync({
      outPoint: spore!.cell!.outPoint!,
      fromInfos: [address],
      config: predefinedSporeConfigs.Aggron4,
    });
    hideOverlay();
    enqueueSnackbar('Melt Successful', {variant: 'success'})
    handleMeltModal()
    router.push('/')
  }

  useEffect(() => {
    if(!isSporeLoading) {
      formatNumberWithCommas(BI.from(spore?.cell?.cellOutput.capacity).toNumber() / 10 ** 8)
    }
  }, [isSporeLoading, spore?.cell?.cellOutput.capacity])

  return (
    <div className="flex flex-col items-center p-4">
      <LoadingOverlay isVisible={isVisible} texts={texts} />
      <MeltGiftModal onClose={handleMeltModal} amount={occupied} onMelt={handleMelt} isOpen={isMeltModal}/>
      <div className='w-full flex justify-between'>
        <div className='flex items-center gap-2'>
          <button onClick={() => router.back()} className="self-start">
            <KeyboardBackspaceIcon className='text-white001' />
          </button>
          <div className='text-white001 font-SourceSanPro text-body1mb font-bold'>{pathAddress.slice(0,6)}...{pathAddress.slice(pathAddress.length - 6, pathAddress.length)}</div>
        </div>
        <div className='flex gap-2'>
          <ContentCopyIcon className='text-white001 cursor-pointer' onClick={() => {handleCopy(pathAddress)}}/>
          <Link href={`https://pudge.explorer.nervos.org/transaction/${spore?.cell?.outPoint?.txHash}`} target='_blank'>
            <LanguageIcon className='text-white001 cursor-pointer' />
          </Link>
        </div>
      </div>
      <div className="py-4">
        <img src={`/api/media/${address}`} width={300} height={200} className="px-4" alt="Gift" />
      </div>
      <div className='text-white001 font-PlayfairDisplay text-hd2mb'>
        {occupied} CKB 
      </div>
      <p className="py-4 font-SourceSanPro text-white001 text-body1mb">“Gift Message”</p>
      <button className="w-full h-12 font-PlayfairDisplay border border-white002 my-4 py-2 px-4 rounded text-white001" onClick={handleMeltModal}>Melt</button>
      <Link className="w-full h-12 flex justify-center items-center font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" 
        href={`/send?hasGift=${address}`}>Send as Gift</Link>
    </div>
  );
};

export default Gift;
