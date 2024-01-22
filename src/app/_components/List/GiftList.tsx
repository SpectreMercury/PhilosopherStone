import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import CheckIcon from '@mui/icons-material/Check';
import List from './List';
import { QuerySpore } from '@/hooks/useQuery/type';
import useWindowDimensions from '@/hooks/getWindowDimension';
import BlindBoxList from './_bList';

interface GiftListProps {
  onNewGiftClick?: () => void;
  list: QuerySpore[];
  type: string;
  blindboxList: [];
  interactionType?: number
}

const GiftList: React.FC<GiftListProps> = ({ onNewGiftClick, list, type, blindboxList = [], interactionType = 1 }) => {
  const [gifts, setGifts] = useState<QuerySpore[]>(list);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const { width } = useWindowDimensions();

  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setGifts(list)
  }, [list])

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  return (
    <div className='mb-8'>
      {/* <div className={`mt-4 ${width >= 1280 && 'flex gap-8 justify-between items-center'}`}>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-3 rounded-full bg-primary008 ${width < 1280 && "w-full"}`}
            placeholder="Search gifts..."
        />
        {width >= 1280 &&
          <div 
            className="text-primary003 font-SourceSanPro text-body1mb" 
            onClick={onNewGiftClick}>
              + New Gift
          </div>
        }
      </div> */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className='text-white001'>{type === 'Gift' ? gifts.length : blindboxList.length} {gifts.length === 1 ? "Gift" : "Gifts"}</span>
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
          style={{width: 44, height: 44, position:"absolute", bottom: 32, right: 16}} 
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
