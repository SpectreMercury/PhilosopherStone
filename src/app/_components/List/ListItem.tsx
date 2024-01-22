import React from 'react';
import Image from 'next/image';

import { QuerySpore } from '@/hooks/useQuery/type';
import { BI } from '@ckb-lumos/lumos';
import Link from 'next/link';
import { boxData } from '@/types/BlindBox';

interface ItemProps {
  gift: QuerySpore | boxData;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'list' | 'grid';
  interactionType?: number
}

const ListItem: React.FC<ItemProps> = ({ gift, isSelected, onSelect, viewMode, interactionType }) => {
  const isQuerySpore = (gift: QuerySpore | boxData): gift is QuerySpore => {
    return (gift as QuerySpore).cell !== undefined;
  };
  const isSpore = isQuerySpore(gift);

  const listItemContent = (
    <div 
      className={`${isSelected ? 'border-success-function border-2' : 'border-white009'} bg-primary008 relative cursor-pointer
        ${viewMode === 'list' ? 'flex items-center px-4 border-t-[1px]' : 'border rounded'} `}
      onClick={interactionType && interactionType > 1 ? onSelect : undefined}
    >
      <div className={`${viewMode === 'list' ? 'w-12 h-12 mr-4' : 'h-[120px]'} relative`}>
        <img alt={gift.id!} src={`/api/media/${gift.id}`} className="rounded max-h-[120px] object-cover w-full"/>
      </div>
      <div className="w-[115px] ml-4 h-[80px] flex-grow flex flex-col items-start justify-center">
        <p className="font-semibold font-SourceSanPro text-body1mb text-white001">{gift.id.slice(0,6)}...{gift.id.slice(gift.id.length - 6,gift.id.length)}</p>
        {
          isSpore && <p className="font-normal font-SourceSanPro text-labelmb text-white007">{BI.from(gift.cell?.cellOutput.capacity).toNumber() / 10 ** 8} CKB</p>
        }
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
  return interactionType && interactionType > 1 ? listItemContent : (
    <Link href={`/gift/${gift.id}`}>
      {listItemContent}
    </Link>
  );
};

export default ListItem;
