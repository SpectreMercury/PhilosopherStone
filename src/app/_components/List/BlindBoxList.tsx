import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import List from './List';
import { QuerySpore } from '@/hooks/useQuery/type';
import useWindowDimensions from '@/hooks/getWindowDimension';
import { boxData } from '@/types/BlindBox';

interface BlindBoxListProps {
  onNewGiftClick?: () => void;
  updateGiftList?: (ids: string[]) => void;
  list: boxData[];
  interactionType?: number;
  selectedList: string[];
  disableList?: string[]; 
}

const BlindBoxList: React.FC<BlindBoxListProps> = ({ onNewGiftClick, list, interactionType = 1,updateGiftList, selectedList, disableList }) => {
  const [gifts, setGifts] = useState<boxData[]>(list);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<string[]>(selectedList ? selectedList: []);
  const { width } = useWindowDimensions();

  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setSelectedGifts(selectedList);
  }, [selectedList]);

  useEffect(() => {
    if (updateGiftList) {
      updateGiftList(selectedGifts);
    }
  }, [selectedGifts]); 


  useEffect(() => {
    setGifts(list)
  }, [list])

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  return (
    <div className='mb-8'>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className='text-white001 text-labelmb font-SourceSanPro'>{list.length} {list.length === 1 ? "Gift" : "Gifts"}</span>
          {/* <button className="cursor-pointer ml-4 text-primary004">Select All</button> */}
        </div>
        <div onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
          {viewMode === "grid" ? 
            <Image 
              className="cursor-pointer"
              alt='list view icon'
              src='/svg/icon-list.svg'
              width={24}
              height={24}
            /> : 
             <Image
              className="cursor-pointer"
              alt='grid view icon'
              src='/svg/icon-grid.svg'
              width={24}
              height={24}
          />}
        </div>
      </div>
      <List
        gifts={gifts}
        onGiftClick={handleSelectGift}
        isGiftSelected={isGiftSelected}
        interactionType={interactionType}
        viewMode={viewMode}
      />
    </div>
  );
};

export default BlindBoxList;
