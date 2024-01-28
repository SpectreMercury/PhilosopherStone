// components/GiftList/GiftList.tsx
import React from 'react';
import ListItem from './ListItem';
import { QuerySpore } from '@/hooks/useQuery/type';
import { boxData } from '@/types/BlindBox';

interface GiftListProps {
  gifts: QuerySpore[] | boxData[];
  onGiftClick: (id: string) => void;
  isGiftSelected: (id: string) => boolean;
  onNewGiftClick?: () => void;
  selectedList?: string[];
  viewMode: 'list' | 'grid';
  disableList?: string[];
  /**
   * @interactionType
   * 1 => redirect to gift page
   * 2 => support select single item
   * 3 => support select multi item
   */
  interactionType?: number; 
}

const List: React.FC<GiftListProps> = ({ gifts, onGiftClick, isGiftSelected, onNewGiftClick, viewMode, interactionType = 1, disableList }) => {
  console.log('heihei')
  return (
    <div className='mb-8'>
      <div className={`${viewMode === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4'} mt-4`}>
        {gifts.map(gift => {
          const isDisabled = disableList?.includes(gift.id)
          return (
            <ListItem 
              key={gift.id}
              gift={gift}
              isDisabled={isDisabled}
              isSelected={isGiftSelected(gift.id)}
              onSelect={() => !isDisabled && onGiftClick(gift.id)}
              viewMode={viewMode}
              interactionType={interactionType}
            />
          )
        })}
      </div>
    </div>
  );
};

export default List;
