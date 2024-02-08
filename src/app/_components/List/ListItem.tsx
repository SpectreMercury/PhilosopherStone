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
  interactionType?: number;
  isDisabled?: boolean
}

const ListItem: React.FC<ItemProps> = ({ gift, isSelected, onSelect, viewMode, interactionType, isDisabled }) => {
  const isQuerySpore = (gift: QuerySpore | boxData): gift is QuerySpore => {
    return (gift as QuerySpore).cell !== undefined;
  };
  const isSpore = isQuerySpore(gift);
  const listView = viewMode === 'list';

  const listItemContent = (
    <div 
      className={`relative ${(isSelected && !listView) ? 'border-success-function border-2' : 'border-white009'} ${isSelected && 'bg-selected'} relative cursor-pointer
        ${listView ? 'flex items-center px-4 border-t-[1px]' : 'border rounded'} `}
      onClick={interactionType && interactionType > 1 ? onSelect : undefined}
    >
      {isDisabled && (
        <div className="z-10 absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center cursor-not-allowed"></div>
      )}
      <div className={`${listView ? 'w-12 h-12 mr-4' : 'h-[120px]'} relative`}>
        <img alt={gift.id!} src={`/api/media/${gift.id}`} className="rounded max-h-[120px] object-cover h-full w-full"/>
      </div>
      <div className="w-[115px] ml-4 h-[80px] flex-grow flex flex-col items-start justify-center">
        <p className="font-SourceSanPro text-body1bdmb text-white001">{gift.id.slice(0,6)}...{gift.id.slice(gift.id.length - 6,gift.id.length)}</p>
        {
          isSpore && <p className="font-SourceSanPro text-labelmb text-white003">{Math.ceil(BI.from(gift.cell?.cellOutput.capacity).toNumber() / 10 ** 8)} CKB</p>
        }
      </div>
      {isSelected && (
        <div className={`absolute ${listView ? 'right-4' : 'top-2 right-2'} w-6 h-6 rounded-full bg-green-500 border-green-500 flex items-center justify-center`}>
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
