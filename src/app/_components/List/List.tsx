// components/GiftList/GiftList.tsx
import React from 'react';
import ListItem from './ListItem';
import { QuerySpore } from '@/hooks/useQuery/type';

interface GiftListProps {
  gifts: QuerySpore[];
  onGiftClick: (id: string) => void;
  isGiftSelected: (id: string) => boolean;
  onNewGiftClick?: () => void;
  viewMode: 'list' | 'grid';
  /**
   * @interactionType
   * 1 => redirect to gift page
   * 2 => support select single item
   * 3 => support select multi item
   */
  interactionType?: number; 
}

const List: React.FC<GiftListProps> = ({ gifts, onGiftClick, isGiftSelected, onNewGiftClick, viewMode, interactionType }) => {
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
            interactionType={interactionType}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
