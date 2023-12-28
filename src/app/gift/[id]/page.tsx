"use client"

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useSporeQuery } from '@/hooks/useQuery/useQuerybySpore';

const Gift: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  const address = pathName.split("/")[pathName.split('/').length - 1]
  const ckbOccupied = useSearchParams()
  const { data: spore, isLoading: isSporeLoading } = useSporeQuery(
    address as string,
  );

  function formatNumberWithCommas(num: string): string {
    const numStr = num.toString();
    const reversedNumStr = numStr.split('').reverse().join('');
    const commaInserted = reversedNumStr.replace(/(\d{3})(?=\d)/g, '$1,');
    return commaInserted.split('').reverse().join('');
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className='w-full flex justify-between'>
        <div className='flex items-center gap-2'>
          <button onClick={() => router.back()} className="self-start">
            <KeyboardBackspaceIcon className='text-white001' />
          </button>
          <div className='text-white001'>{address.slice(0,6)}...{address.slice(address.length - 6, address.length)}</div>
        </div>
        <div className='flex gap-2'>
          <ContentCopyIcon className='text-white001 cursor-pointer' onClick={() => {handleCopy(address)}}/>
          <Link href={`https://pudge.explorer.nervos.org/transaction/${spore?.cell?.outPoint?.txHash}`} target='_blank'>
            <LanguageIcon className='text-white001 cursor-pointer' />
          </Link>
        </div>
      </div>
      <div className="py-4">
        <img src={`/api/media/${address}`} width={300} height={200} className="px-4" alt="Gift" />
      </div>
      <div className='text-white001 font-PlayfairDisplay text-hd2mb'>
        {formatNumberWithCommas(ckbOccupied.get('occupied')!!)} CKB
      </div>
      <p className="py-4 font-SourceSanPro text-white001 text-body1mb">“Gift Message”</p>
      <button className="w-full h-12 font-PlayfairDisplay border border-white002 my-4 py-2 px-4 rounded text-white001">Melt</button>
      <Link className="w-full h-12 flex justify-center items-center font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" 
        href={`/send?hasGift=${address}`}>Send as Gift</Link>
    </div>
  );
};

export default Gift;
