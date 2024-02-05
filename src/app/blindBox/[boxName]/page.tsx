"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AddGiftsModal from '@/app/_components/AddGiftsModal/AddGiftsModal';
import BlindBoxList from '@/app/_components/List/BlindBoxList';
import { fetchBlindBoxAPI } from '@/utils/fetchAPI';
import { boxData } from '@/types/BlindBox';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/_components/Button/Button';

const BlindBoxPage = () => {
  const router = useRouter();
  const pathName = usePathname();
  const boxName = pathName.split("/")[pathName.split('/').length - 1]
  const [boxGifts, setBoxGifts] = useState<boxData[]>([])
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const [inBlindBoxList, setInBlindBoxList] = useState<string[]>([])
  
  const getBlindBox = async () => {
    const data = await fetchBlindBoxAPI({
      action: 'getBoxByName',
      key: walletAddress!!,
      name: decodeURIComponent(boxName)
    })
    setBoxGifts(data.box.boxData)
  }

  const getInBlindBoxList = async () => {
    const data = await fetchBlindBoxAPI({
      action: 'getInBlindBoxList',
      key: walletAddress!!,
      name: boxName
    })
    setInBlindBoxList(data.data)
  }

  const addToBlindBox = async (ids: string[]) => {
    const data = await fetchBlindBoxAPI({ 
      action: 'add', 
      key: walletAddress!!, 
      name: decodeURIComponent(boxName), 
    ids: ids})
    setBoxGifts(data.data)
  }

  const convertToObjects = (ids: string[]) => {
    return ids.map(item => ({ id: item }));
  }

  const removeGifts = async (ids: string[]) => {
    const data = await fetchBlindBoxAPI({ 
      action: 'remove', 
      key: walletAddress!!, 
      name: decodeURIComponent(boxName), 
      ids: ids
    });
    setBoxGifts(data.data)
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getSelectedList = (ids: string[]) => {
    setSelectedGifts(ids)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onConfirm = (ids: string[]) => {
    addToBlindBox(ids)
    getBlindBox()
  }

  const onRemoveGifts = () => {
    removeGifts(selectedGifts)
  }

  const cancelRemove = () => {
    setSelectedGifts([])
  }


  useEffect(() => {
    if(walletAddress) {
      getBlindBox();
      getInBlindBoxList();
    }
  }, [boxName, walletAddress]);

  if (!boxName) {
    return <p>Loading...</p>; 
  }

  return (
    <div className='flex flex-col flex-1 px-4 pb-12'>
      {isModalOpen && 
        <AddGiftsModal 
          onConfirm={onConfirm} 
          onClose={handleCloseModal} 
          walletAddress={walletAddress!!} 
          listItems={boxGifts} 
          disableList={inBlindBoxList}
        />}
      <div className={'flex items-center mt-8'}>
        <button onClick={() => router.back()}>
          <Image 
            src='/svg/icon-arrow-left.svg'
            width={24}
            height={24}
            alt={"Go back"}
          />
        </button>
        <div className='ml-3 text-white text-subheadermb font-SourceSanPro'>{decodeURIComponent(boxName)}</div>
      </div>
      <div className={`flex-1 flex ${boxGifts.length > 0 ? 'items-start' : 'items-center'}  justify-center`}> 
        {(boxGifts && !boxGifts.length) && (
          <div className='flex flex-col gap-8 w-full mt-12 justify-center items-center'>
              <Image 
                src='/svg/blindbox-empty-illus.svg'
                width={170}
                height={170}
                alt='There&apos;s no gifts in this Blind Box'
              />
           
            <p className="text-labelmb font-SourceSanPro text-center text-white005">No Gifts in this Blind Box</p>
            <Button type='solid' label='Add Gifts' onClick={handleOpenModal} />
          </div>
        )}
        {boxGifts.length > 0 ? (
          <div className='w-full'>
            <BlindBoxList 
              list={boxGifts}  
              interactionType={3} 
              updateGiftList={getSelectedList} 
              selectedList={selectedGifts}
            />
          </div>
        ) : (
          <></>
        )}
        
      </div>
      <div className='flex gap-4'>
        {
          selectedGifts.length > 0 && (
            <>
              <Button type='outline' label='Remove Gifts' onClick={onRemoveGifts} />
              <Button type='outline' label='Cancel' onClick={cancelRemove} />
            </>
            
          )
        }
        {boxGifts && boxGifts.length > 0 && selectedGifts.length <= 0 && (
            <>
              <Button type='outline' label='Add Gifts' onClick={handleOpenModal} />
              <Button type='solid' label='Send Blind Box' href={`/send?type=BlindBox&name=${decodeURIComponent(boxName)}`} />
            </>
            
        )}
      </div>
    </div>
  );
};

export default BlindBoxPage;
