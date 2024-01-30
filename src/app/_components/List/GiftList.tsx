import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import List from './List';
import { QuerySpore } from '@/hooks/useQuery/type';
import useWindowDimensions from '@/hooks/getWindowDimension';
import BlindBoxList from './_bList';
import { fetchGiftAPI } from '@/utils/fetchAPI';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { BlindBoxItemType } from './_bList';

interface GiftListProps {
  onNewGiftClick?: () => void;
  list: QuerySpore[];
  type: string;
  blindboxList: BlindBoxItemType[];
  interactionType?: number
}

const GiftList: React.FC<GiftListProps> = ({ onNewGiftClick, list, type, blindboxList = [], interactionType = 1 }) => {
  const [gifts, setGifts] = useState<QuerySpore[]>(list);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const [inProcessingList, setInProcessingList] = useState<string[]>([]);
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const unavailableList = useSelector((state: RootState) => state.unavailableList.list);

  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  const getInProcessingList = async (k: string) => {
    // const inProcessingGifts = await fetchGiftAPI({
    //   action: 'getUnavailableGifts',
    //   key: k,
    // })
    // if (!inProcessingGifts.data) return 
    // const filtered = Object.values(inProcessingGifts.data).filter(item => item !== 'create');
    // setGifts(list.filter(item => !filtered.includes(item.id)));
  }

  useEffect(() => {
    if(walletAddress) {
      setGifts(list.filter(item => !unavailableList?.includes(item.id)));
    }
  }, [list, walletAddress, unavailableList])

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  return (
    <div className='mb-8'>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className='text-white001 text-labelmb font-SourceSanPro'>
            {type === 'Gift' ? gifts.length : blindboxList.length} 
            {type === 'Gift' ? gifts.length === 1 ? " Gift" : " Gifts" : blindboxList.length === 1 ? " Blind Box" : " Blind Boxes"}
          </span>
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
      { type === 'Gift' ? (<List
        gifts={gifts}
        onGiftClick={handleSelectGift}
        isGiftSelected={isGiftSelected}
        interactionType={interactionType}
        viewMode={viewMode}
      />) : (<BlindBoxList gifts={blindboxList}
        onGiftClick={handleSelectGift}
        isGiftSelected={isGiftSelected}
        viewMode={viewMode} />)}

      {/* Floating add icon */}
      {width < 1280 &&
        <div 
          style={{width: 44, height: 44, position:"fixed", bottom: 32, right: 16}} 
          className="cursor-pointer flex items-center justify-center rounded-full bg-primary007 text-primary003 text-body1mb" 
          onClick={onNewGiftClick}>
            <Image 
              className="cursor-pointer"
              alt='add icon'
              src='/svg/icon-plus.svg'
              width={24}
              height={24}
            />
        </div>
      }
    </div>
  );
};

export default GiftList;
