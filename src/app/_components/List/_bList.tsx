import React from 'react';
import BlindBoxItem from './_bListItem';
import { boxData } from '@/types/BlindBox';

interface BlindBoxItemType {
    id: string;
    boxData: boxData[];
}

interface BlindBoxListProps {
  gifts:BlindBoxItemType[]; // 替换为盲盒数组类型
  onGiftClick: (id: string) => void;
  isGiftSelected: (id: string) => boolean;
  viewMode: 'list' | 'grid';
  interactionType?: number;
}

const _bList: React.FC<BlindBoxListProps> = ({ gifts, onGiftClick, isGiftSelected, viewMode, interactionType }) => {
  return (
    <div className='mb-8'>
      <div className={`${viewMode === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4'} mt-4`}>
        {gifts.map(box => (
          <BlindBoxItem 
            key={box.id}
            blindBox={box}
            isSelected={isGiftSelected(box.id)}
            onSelect={() => onGiftClick(box.id)}
            viewMode={viewMode}
            interactionType={interactionType}
          />
        ))}
      </div>
    </div>
  );
};

export default _bList;
