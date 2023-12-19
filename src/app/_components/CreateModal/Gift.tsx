"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Select from '../common/Select/Select';
import { useDropzone } from 'react-dropzone';
import useEstimatedOnChainSize from '@/hooks/useEstimatedOnChainSize/useEstimatedOnChainSize';
import Image from 'next/image';
import { enqueueSnackbar } from 'notistack';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import useWalletBalance from '@/hooks/useBalance';
import { createSpore, predefinedSporeConfigs } from '@spore-sdk/core';
import { useConnect } from '@/hooks/useEstimatedOnChainSize/useConnect';
import { sendTransaction } from '@/utils/transaction';
import { getMIMETypeByName } from '@/utils/mime';
import { trpc } from '@/app/_trpc/client';
import { useMutation } from '@tanstack/react-query';
import { BI } from '@ckb-lumos/lumos';

const selectOptions = [
  { value: 'box1', label: 'Box 1' },
  { value: 'box2', label: 'Box 2' },
  { value: 'box3', label: 'Box 3' },
  { value: 'box4', label: 'Box 4' },
];

interface UploadedImage {
  file: File;
  preview: string;
}

const CreateGift: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [clusterId, setClusterId] = useState(undefined)
  const onChainSize = useEstimatedOnChainSize(
    clusterId,
    file,
    false,
  );
  const { address, lock, signTransaction } = useConnect()
  const [capacityList, setCapacityList] = useState<number[]>([]);
  const [totalCapacity, setTotalCapacity] = useState<number>(0) 
  
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const balance = useWalletBalance(walletAddress!!)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      onChainSize,
    }));
    acceptedFiles.filter(file => {
      if (file.size > 300 * 1024) {
        enqueueSnackbar('File size exceeds 300 KB', { variant: 'error' });
        return false;
      } else {
        setUploadedImages(current => [...current, ...newImages]);
        setFile(acceptedFiles[0]);
      }
    });
  }, []);

  const addSpore = useCallback(
    async (...args: Parameters<typeof createSpore>) => {
      let { txSkeleton, outputIndex } = await createSpore(...args);
      const signedTx = await signTransaction(txSkeleton);
      await sendTransaction(signedTx);
      const outputs = txSkeleton.get('outputs');
      const spore = outputs.get(outputIndex);
      return spore;
    },
    [signTransaction],
  );

  const addSporeMutation = useMutation(addSpore, {
    onSuccess: () => {
      console.log()
    },
  });

  const handleSubmit = useCallback(
    async (
      content: Blob | null,
      clusterId: string | undefined,
      useCapacityMargin?: boolean,
    ) => {
      if (!content || !walletAddress || !lock) {
        return;
      }

      const contentBuffer = await content.arrayBuffer();
      const contentType = content.type || getMIMETypeByName(content.name);
      const spore = await addSporeMutation.mutateAsync({
        data: {
          contentType,
          content: new Uint8Array(contentBuffer),
          clusterId,
        },
        fromInfos: [walletAddress],
        toLock: lock,
        config: predefinedSporeConfigs.Aggron4,
        // @ts-ignore
        capacityMargin: useCapacityMargin ? BI.from(100_000_000) : BI.from(0),
      });
      enqueueSnackbar('Gift Mint Successful', { variant: 'success' });
      close();
    },
    [walletAddress, lock, addSporeMutation],
  );

  useEffect(() => {
    if(onChainSize === 0) {
      return
    }
    setCapacityList(currentList => [...currentList, onChainSize]);
  }, [file, onChainSize])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveImage = (index: number) => {
    setUploadedImages(current => current.filter((_, idx) => idx !== index));
    setCapacityList(currentList => currentList.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    console.log(capacityList)
    setTotalCapacity(capacityList.reduce((acc, curr) => acc + curr, 0))
  }, [capacityList])


  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div>
      <p className='text-white001 font-SourceSanPro font-normal mb-2'>Assign to a blind box(optional)</p>
      <Select options={selectOptions} onSelect={handleSelectChange} />
      <div {...getRootProps()} className="border-dashed h-[280px] rounded-md border-2 border-gray-300 p-4 mt-4 text-center">
        <input {...getInputProps()} />
        {
          isDragActive ?
            (<Image
              src='/svg/image-uploader.svg'
              width={99}
              height={99}
              alt='uploader'/>): (<>
                <div className='h-full flex flex-col items-center justify-center'>
                  <Image
                    src='/svg/image-uploader.svg'
                    width={99}
                    height={99}
                    alt='uploader'/>
                  <p className='mt-8 mb-1 text-white001 font-bold font-SourceSanPro'>Click To Upload</p>
                  <p className='text-white004 font-SourceSanPro'>Maximum file size: 300 KB</p>
                </div>
              </>)
        }
      </div>
      <div className="mt-4 max-h-[300px] overflow-auto">
        {uploadedImages.map((image, index) => (
          <div key={index} className="bg-primary008 px-4 py-2 rounded-md flex items-center justify-between my-2">
            <img src={image.preview} alt={`uploaded ${index}`} className="w-16 h-16 object-cover" />
            <div>
              <p className='w-32 text-white001 text-body1mb font-semibold font-SourceSanPro overflow-hidden overflow-ellipsis whitespace-nowrap'>{image.file.name}</p>
              <p className='text-white004 text-body1mb font-SourceSanPro'> Estimate ≈ {onChainSize} CKBytes</p>
            </div>
            <div onClick={() => handleRemoveImage(index)}>
              <Image 
                src='/svg/remove-upload.svg'
                width={32}
                height={32}
                alt='remove-upload'
              />
            </div>
          </div>
        ))}
        <div className='text-light-error-function font-SourceSanPro text-sm'>Not enough CKByte in your wallet. You can get some CKByte from <Link className=' underline' target='_blank' href={'https://faucet.nervos.org/'}> Nervos Pudge Faucet</Link> </div>
        <div className='text-white001 font-SourceSanPro text-sm'>Estimate Total on Chain Size ≈ {totalCapacity}</div>
      </div>
      <button 
        className={`w-full h-[48px] bg-white001 border border-primary003 font-PlayfairDisplay text-primary011 py-2 px-4 rounded mt-4 ${'bg-gray-300 text-gray-500'}`}
        disabled={!file}
        onClick={async () => {
          await handleSubmit(file, undefined, false)
        }}
      >
        Create Gift
      </button>
    </div>
  );
};

export default CreateGift;
