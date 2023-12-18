// components/GiftList/GiftList.tsx
import React from 'react';
import ListItem from './ListItem';
import { Gift } from '@/types/Gifts';

interface GiftListProps {
  gifts: Gift[];
  onGiftClick: (id: string) => void;
  isGiftSelected: (id: string) => boolean;
  onNewGiftClick?: () => void;
  viewMode: 'list' | 'grid';
}

const List: React.FC<GiftListProps> = ({ gifts, onGiftClick, isGiftSelected, onNewGiftClick, viewMode }) => {
  return (
    <div className='mb-8'>
      <div className={`${viewMode === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4'} mt-4`}>
        {gifts.map(gift => (
          <ListItem 
            key={gift.id}
            gift={gift}
            isSelected={isGiftSelected(gift.id)}
            onSelect={() => onGiftClick(gift.id)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
