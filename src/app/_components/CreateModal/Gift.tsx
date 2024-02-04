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
import { useConnect } from '@/hooks/useConnect';
import { sendTransaction } from '@/utils/transaction';
import { getMIMETypeByName } from '@/utils/mime';
import { trpc } from '@/app/_trpc/client';
import { useMutation } from '@tanstack/react-query';
import { BI, Hexadecimal, config } from '@ckb-lumos/lumos';
import useLoadingOverlay from '@/hooks/useLoadOverlay';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import SporeService from '@/spore';
import useLumosScript from '@/hooks/useUpdateLumosConfig';
import { getLumosScript } from '@/utils/updateLumosConfig';
import { predefined } from '@ckb-lumos/lumos/config';
import { fetchHistoryAPI } from '@/utils/fetchAPI';
import { sporeConfig } from '@/utils/config';

interface CreateGiftProps {
  onClose?: () => void; //
}


interface UploadedImage {
  file: File;
  preview: string;
}

const CreateGift: React.FC<CreateGiftProps> = ({ onClose }) => {
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
  const { isVisible, showOverlay, hideOverlay, progressStatus, setProgressStatus } = useLoadingOverlay(); 
  const texts = ["Unmatched Flexibility and Interopera­bility", "Supreme Security and Decentrali­zation", "Inventive Tokenomics"]; 
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const walletType = useSelector((state: RootState) => state.wallet.wallet?.walletType);
  const ethAddress = useSelector((state: RootState) => state.wallet.wallet?.ethAddress);
  const balance = useWalletBalance(walletAddress!!)
  const { refresh: refreshSporesByAddress } = useSporesByAddressQuery(walletAddress, false);

  // const onDrop = useCallback(async (acceptedFiles: File[]) => {
  //   const newImages = acceptedFiles.map(file => ({
  //     file,
  //     preview: URL.createObjectURL(file),
  //     onChainSize,
  //   }));
  //   acceptedFiles.filter(file => {
  //     if (file.size > 300 * 1024) {
  //       enqueueSnackbar('File size exceeds 300 KB', { variant: 'error' });
  //       return false;
  //     } else {
  //       setUploadedImages(current => [...current, ...newImages]);
  //       setFile(acceptedFiles[0]);
  //     }
  //   });
  // }, []);

    
  async function PutIntoProcessList(key: string, id: string) {
    const response = await fetchHistoryAPI({
      action: 'setHistory',
      key,
      record: {
        actions: 'create',
        status: 'pending',
        from: walletAddress!!,
        id: id
      }
    })
    return response
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];

    if (!newFile) return;

    if (newFile.size > 300 * 1024) {
      enqueueSnackbar('File size exceeds 300 KB', { variant: 'error' });
      return;
    }

    setUploadedImages([{ file: newFile, preview: URL.createObjectURL(newFile) }]);
    setFile(newFile);
  }, []);

  const addSpore = useCallback(
    async (...args: Parameters<typeof createSpore>) => {
      let { txSkeleton, outputIndex } = await createSpore(...args);
      const signedTx = await signTransaction(txSkeleton);
      const txHash = await sendTransaction(signedTx);
      await PutIntoProcessList(walletAddress!!, txHash!!);
      const outputs = txSkeleton.get('outputs');
      const spore = outputs.get(outputIndex);
      return spore;
    },
    [signTransaction],
  );

  const addSporeMutation = useMutation({
    mutationFn: addSpore,
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
    showOverlay();
    try {
      const contentBuffer = await content.arrayBuffer();
      const contentType = content.type || getMIMETypeByName(content.name);
      console.log(address);
      const spore = await addSporeMutation.mutateAsync({
        data: {
          contentType,
          content: new Uint8Array(contentBuffer),
          clusterId,
        },
        fromInfos: [walletAddress],
        toLock: lock,
        config: sporeConfig,
        // @ts-ignore
        capacityMargin: useCapacityMargin ? BI.from(100_000_000) : BI.from(0),
      });
      refreshSporesByAddress()
      enqueueSnackbar('Gift Mint Successful', { variant: 'success' });
    } catch (error) {
      console.error(error)
      enqueueSnackbar('An error occurred', { variant: 'error' });
    } finally {
      setProgressStatus('done')
      setTimeout(() => {
        hideOverlay();
      }, 1000)
    }

    onClose?.(); ;
  },
  [walletAddress, lock, addSporeMutation, showOverlay, hideOverlay],
);


  useEffect(() => {
    if(onChainSize === 0) {
      return
    }
    setCapacityList(currentList => [...currentList, onChainSize]);
  }, [file, onChainSize])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };

  const handleRemoveImage = (index: number) => {
    setFile(null);
    setUploadedImages(current => current.filter((_, idx) => idx !== index));
    setCapacityList(currentList => currentList.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
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
      <LoadingOverlay isVisible={isVisible} texts={texts} progressStatus={progressStatus}/>
      {/* <p className='text-white001 font-SourceSanPro font-normal mb-2'>Assign to a Blind Box(optional)</p> */}
      {/* <Select options={selectOptions} onSelect={handleSelectChange} /> */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <p className='font-SourceSanPro text-labelmb text-white003 mr-2'>Address: </p>
          <div className='flex gap-2'>
            {walletType === 'JoyID' ? 
              <Image 
                alt='wallet-icon'
                src='/svg/joyid-icon.svg'
                width={18}
                height={18}
              />:
              <Image 
                alt='wallet-icon'
                src='/svg/metamask-icon.svg'
                width={18}
                height={18}
              />
            }
            <div className='text-white001 font-SourceSanPro text-labelbdmb'>{walletAddress?.slice(0, 10)}...{walletAddress?.slice(walletAddress.length - 10, walletAddress.length)}</div>
          </div>
        </div>
        <button onClick={() => {walletAddress && handleCopy(walletAddress)}}>
          <Image
            src='/svg/icon-copy.svg'
            width={18}
            height={18}
            alt='Copy address'
          />
        </button>
      </div>
      <div className='flex items-center mt-2'>
        <p className='text-white003 font-SourceSanPro text-labelmb mr-2'>Balance: </p>
        <p className='text-white001 font-SourceSanPro text-labelbdmb'>{`${balance} CKB`}</p>
      </div>
      {/* TODO: Always display the droppable area once we support batch upload */}
      {!file &&
      <div 
        {...getRootProps()} 
        className="cursor-pointer bg-primary008 border-dashed h-[232px] rounded-md border-2 border-gray-300 p-4 mt-4 text-center"
      >
        <input {...getInputProps()} />
        {
          <div className='h-full flex flex-col items-center justify-center'>
          <Image
            src='/svg/image-uploader.svg'
            width={88}
            height={88}
            alt='uploader'/>
            {!isDragActive &&
              <>
                <p className='mt-6 mb-2 text-white001 font-SourceSanPro underline text-body1bdmb'>Click to upload a file</p>
                <p className='text-white003 font-SourceSanPro text-labelmb'>Maximum file size: 300 KB</p>
              </>
            }
        </div>
        }
      </div>
      }
      <div className="mt-4 max-h-[300px] overflow-auto">
        {uploadedImages.map((image, index) => (
          <div key={index} className="bg-primary008 px-4 py-6 rounded-md flex items-center justify-between my-2">
            <div className='flex gap-4 items-center'>
              <img src={image.preview} alt={`uploaded ${index}`} className="w-16 h-16 object-cover" />
              <div>
                <p className='w-32 text-white001 text-body1mb font-SourceSanPro overflow-hidden overflow-ellipsis whitespace-nowrap'>{image.file.name}</p>
                <p className='text-white003 text-labelmb font-SourceSanPro'> ~ {onChainSize} CKB</p>
              </div>
            </div>
            <div className='cursor-pointer' onClick={() => handleRemoveImage(index)}>
              <Image 
                src='/svg/remove-upload.svg'
                width={32}
                height={32}
                alt='remove-upload'
              />
            </div>
          </div>
        ))}
        {file && balance === 0 && 
          <div 
            className='text-light-error-function font-SourceSanPro text-sm'>
              Not enough CKB in your wallet.
          </div>
        }
        {file && 
          <div className='flex flex-col items-center mt-6'>
            <div className='flex items-center mb-2'>
              <div className='text-white003 font-SourceSanPro text-labelmb mr-2'>Total On-Chain Cost: </div>
              <div className='text-white001 font-SourceSanPro text-labelbdmb'>{` ~${onChainSize} CKB`}</div>
            </div>
            {balance - onChainSize >= 1 ?
              <div className='flex items-center'>
                <div className='text-white003 font-SourceSanPro text-labelmb mr-2'>Remaining Balance: </div>
                <div className='text-white001 font-SourceSanPro text-labelbdmb'>{` ~${balance - onChainSize} CKB`}</div>
              </div>
              :
              <div className='text-light-error-function font-SourceSanPro text-labelmb'>Not enough CKB in your wallet</div>
            }
          </div>
        }
      </div>
      <button 
        className={`cursor-pointer w-full h-[48px] bg-white001 border border-primary009 text-buttonmb font-SourceSanPro text-primary011 py-2 px-4 rounded mt-6 
          ${(!file || balance - onChainSize < 1 ) && 'opacity-50 cursor-not-allowed'}`}
        disabled={!file || balance - onChainSize < 1}
        onClick={async () => {
          await handleSubmit(file, undefined, true)
        }}
      >
        Create
      </button>
    </div>
  );
};

export default CreateGift;
