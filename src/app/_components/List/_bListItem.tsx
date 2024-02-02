import React from 'react';
import Image from 'next/image';
import { QuerySpore } from '@/hooks/useQuery/type'; // 这应该替换为您的盲盒类型
import Link from 'next/link';
import { boxData } from '@/types/BlindBox';

interface BlindBoxItem {
    id: string;
    boxData: boxData[];
}


interface BlindBoxItemProps {
  blindBox: BlindBoxItem; // 替换为您的盲盒类型
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'list' | 'grid';
  interactionType?: number;
}

const BlindBoxItem: React.FC<BlindBoxItemProps> = ({ blindBox, isSelected, onSelect, viewMode, interactionType }) => {
  const itemContent = (
    <div 
      className={`${isSelected ? 'bg-primary006' : ''} relative border-white009
        ${viewMode === 'list' ? 'flex items-center px-4 border-t-[1px]' : 'border rounded'} `}
      onClick={interactionType && interactionType > 1 ? onSelect : undefined}
    >
      <div className={`${viewMode === 'list' ? 'w-12 h-12 mr-4' : 'h-[120px]'} relative`}>
        <Image alt={blindBox.id!} src={`${blindBox.boxData.length ? '/svg/blindbox-animation-6.svg' : '/svg/blindbox-animation-1.svg'}`} className="rounded" layout='fill' objectFit='cover'/>
      </div>
      <div className="w-[115px] ml-4 h-[80px] flex-grow flex flex-col items-start justify-center">
        <p className="font-SourceSanPro text-body1bdmb text-white001 max-w-[300px] truncate">
          {blindBox.id}
        </p>  
        <p className="text-white003 font-SourceSanPro text-labelmb text-white001 max-w-[300px] truncate">
          {blindBox.boxData.length ? `${blindBox.boxData.length} ${blindBox.boxData.length === 1 ? "Gift" : "Gifts"}`: 'Empty Box'}
        </p>      
      </div>
      {isSelected && (
        <div className={`absolute ${viewMode === 'list' ? 'right-4' : 'top-2 right-2'} w-6 h-6 rounded-full bg-green-500 border-green-500 flex items-center justify-center`}>
          <Image 
            src='/svg/icon-check.svg'
            width={24}
            height={24}
            alt="Selected"
          />
        </div>
      )}
    </div>
  );

  return interactionType && interactionType > 1 ? itemContent : (
    <Link href={`/blindBox/${blindBox.id}`}>
      {itemContent}
    </Link>
  );
};

export default BlindBoxItem
