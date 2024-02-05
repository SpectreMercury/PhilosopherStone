import React, { useState } from 'react';
import GiftList from '../List/GiftList';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import List from '../List/List';
import { boxData } from '@/types/BlindBox';
import Image from 'next/image';
import Button from '@/app/_components/Button/Button';

interface AddGiftsModalProps {
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  listItems: boxData[]; 
  walletAddress: string;
  disableList?: string[];
}

const AddGiftsModal: React.FC<AddGiftsModalProps> = ({ onClose, onConfirm, listItems, walletAddress, disableList}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<boxData[]>(listItems);

  const { data: spores, isLoading: isSporesLoading } = useSporesByAddressQuery(
    walletAddress as string,
  );
  
  const handleSelectMultipleGifts = (id: string) => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(existingId => existingId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };



  const isGiftSelected = (id: string) => {
    return selectedIds.some(gift => gift === id);
  }

  const handleConfirm = () => {
    onConfirm(selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center">
      <div className="bg-primary011 rounded-lg px-4 py-6 max-w-lg w-full relative mx-4">
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-white001 text-hd3mb font-Montserrat'>Pick Gifts to Blind Box</h3>
            <button onClick={onClose}>
              <Image 
                src='/svg/icon-x.svg'
                width={24}
                height={24}
                alt='close modal'
              />
            </button>
        </div>
        <p className='text-labelmb font-SourceSanPro text-white005'>You can only pick Gifts NOT included in any Blind Box:</p>
        <div style={{ maxHeight: '600px', overflow: 'auto' }}>
          <List
            gifts={spores}
            onGiftClick={handleSelectMultipleGifts}
            isGiftSelected={isGiftSelected}
            viewMode={viewMode}
            interactionType={3}
            selectedList={selectedIds}
            disableList={disableList}
          />
        </div>
        {spores.length === 0 && 
          <div className='flex flex-col gap-4 justify-center items-center mb-6'>
            <Image 
              src='/svg/no-gift-illus.svg'
              width={170}
              height={170}
              alt='No Gifts found'
            />
            <p className='text-white005 font-SourceSanPro text-labelmb'>No Gifts found</p>
          </div>
        }
        <Button type='solid' label={'Add ' + selectedIds.length + ' Gifts'} onClick={handleConfirm}/>
      </div>
    </div>
  );
};

export default AddGiftsModal;
