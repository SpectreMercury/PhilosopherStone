import React from 'react';
import Image from 'next/image';
import CheckIcon from '@mui/icons-material/Check';

interface Gift {
  id: string;
  name: string;
  occupid: string;
  image: string;
}

interface GiftItemProps {
  gift: Gift;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'list' | 'grid';
}

const ListItem: React.FC<GiftItemProps> = ({ gift, isSelected, onSelect, viewMode }) => {
  return (
    <div onClick={onSelect} className={`${isSelected ? 'bg-primary006' : ''} relative ${viewMode === 'list' ? 'flex items-center px-4' : ''} border border-gray-300 rounded`}>
      <div className={`${viewMode === 'list' ? 'w-12 h-12 mr-4' : 'h-[120px]'} relative`}>
        <Image 
          src={gift.image} 
          alt={gift.name} 
          layout="fill" 
          objectFit='cover' 
          className="rounded" 
        />
      </div>
      <div className="w-[115px] mx-auto h-[80px] flex-grow flex flex-col items-start justify-center">
        <p className="font-semibold font-SourceSanPro text-body1mb text-white001">{gift.name}</p>
        <p className="font-normal font-SourceSanPro text-body2mb text-white007">{gift.occupid} CKB</p>
      </div>
      {isSelected && (
        <div className={`absolute ${viewMode === 'list' ? 'right-4' : 'top-2 right-2'} w-6 h-6 rounded-full bg-green-500 border-green-500 flex items-center justify-center`}>
          <CheckIcon className='text-white001' />
        </div>
      )}
    </div>
  );
};

export default ListItem;
