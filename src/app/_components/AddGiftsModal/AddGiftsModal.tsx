import React, { useState } from 'react';
import GiftList from '../List/GiftList';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';
import List from '../List/List';
import { boxData } from '@/types/BlindBox';

interface AddGiftsModalProps {
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  listItems: boxData[]; 
  walletAddress: string;
}

const AddGiftsModal: React.FC<AddGiftsModalProps> = ({ onClose, onConfirm, listItems, walletAddress}) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-primary011 rounded-lg p-4 max-w-lg w-full relative mx-4">
        <div className='relative text-white001 text-hd2mb font-PlayfairDisplay my-4'>Pick Gifts to Blind Box 
        <button  onClick={onClose} className="absolute right-0 text-white001 text-hd2mb font-PlayfairDisplay">X</button></div>
        <div style={{ maxHeight: '600px', overflow: 'auto' }}>
          <List
            gifts={spores}
            onGiftClick={handleSelectMultipleGifts}
            isGiftSelected={isGiftSelected}
            viewMode={viewMode}
            interactionType={3}
            selectedList={selectedIds}
          />
        </div>
        <div className="flex justify-between mt-4 gap-6">
          <button onClick={onClose} className="text-center text-white001 flex-1 border border-primary001 py-4 rounded-lg font-PlayfairDisplay">Cancel</button>
          <button onClick={handleConfirm} className="text-center flex-1 border border-primary001 py-4 rounded-lg font-PlayfairDisplay bg-white001 text-primary011">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AddGiftsModal;
