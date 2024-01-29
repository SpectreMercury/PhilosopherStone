import React, { useState } from 'react';
import GiftList from '../List/GiftList';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import List from '../List/List';
import { boxData } from '@/types/BlindBox';
import Image from 'next/image';

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
        <button 
          onClick={handleConfirm} 
          className="w-full text-center flex-1 border border-primary001 py-4 rounded-lg text-buttonmb font-SourceSansPro bg-white001 text-primary011"
        >
          Add {selectedIds.length} {selectedIds.length === 1 ? " Gift" : " Gifts"}
        </button>
      </div>
    </div>
  );
};

export default AddGiftsModal;
