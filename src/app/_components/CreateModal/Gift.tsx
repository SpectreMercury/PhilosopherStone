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
      await sendTransaction(signedTx);
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
    const latestLumosScript = await getLumosScript();
    let latest = JSON.parse(JSON.stringify(predefinedSporeConfigs.Aggron4))
    latest['lumos'] = latestLumosScript
    try {
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
        config: latest,
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
      {/* <p className='text-white001 font-SourceSanPro font-normal mb-2'>Assign to a blind box(optional)</p> */}
      {/* <Select options={selectOptions} onSelect={handleSelectChange} /> */}
      <div 
        {...getRootProps()} 
        className="cursor-pointer bg-primary008 border-dashed h-[280px] rounded-md border-2 border-gray-300 p-4 mt-4 text-center"
      >
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
                  <p className='mt-8 mb-1 text-white001 font-SourceSanPro text-body1bdmb'>Click To Upload</p>
                  <p className='text-white003 font-SourceSanPro text-labelmb'>Maximum file size: 300 KB</p>
                </div>
              </>)
        }
      </div>
      <div className="mt-4 max-h-[300px] overflow-auto">
        {uploadedImages.map((image, index) => (
          <div key={index} className="bg-primary008 px-4 py-2 rounded-md flex items-center justify-between my-2">
            <div className='flex gap-4 items-center'>
              <img src={image.preview} alt={`uploaded ${index}`} className="w-16 h-16 object-cover" />
              <div>
                <p className='w-32 text-white001 text-body1mb font-semibold font-SourceSanPro overflow-hidden overflow-ellipsis whitespace-nowrap'>{image.file.name}</p>
                <p className='text-white004 text-body1mb font-SourceSanPro'> Estimate ≈ {onChainSize} CKBytes</p>
              </div>
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
        {file && balance === 0 && 
          <div 
            className='text-light-error-function font-SourceSanPro text-sm'>
              Not enough CKByte in your wallet. You can get some CKByte from 
              <Link className=' underline' target='_blank' href={'https://faucet.nervos.org/'}>Nervos Pudge Faucet</Link> 
          </div>
        }
        <div className='flex justify-center'>
          <div className='text-white001 font-SourceSanPro text-body1mb'>Estimate Total On-Chain Size: </div>
          <div className='text-white001 font-SourceSanPro text-body1bdmb'>{` ${onChainSize} CKB`}</div>
        </div>
      </div>
      <button 
        className={`cursor-pointer w-full h-[48px] bg-white001 border border-primary009 font-PlayfairDisplay text-primary011 py-2 px-4 rounded mt-4 ${!file && 'opacity-50 cursor-not-allowed'}`}
        disabled={!file}
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
