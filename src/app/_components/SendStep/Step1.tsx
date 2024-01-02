import React, { MouseEventHandler, useEffect, useState } from 'react';
import List from '../List/List';
import { QuerySpore } from '@/hooks/useQuery/type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useSporesByAddressQuery } from '@/hooks/useQuery/useSporesByAddress';

interface Step1Pros {
  onSelection?: (data:QuerySpore) => void,
  selected? : QuerySpore,
  hasGift?: string | null | undefined
}

const Step1: React.FC<Step1Pros> = ({onSelection, selected, hasGift}) => {
  const [tab, setTab] = useState<'Gift' | 'Spore'>('Gift');
  const [gifts, setGifts] = useState<QuerySpore[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Gift' | 'Blind Box'>('Gift');
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const storeSporesList = useSelector((state: RootState) => state.spores.spores);
  const [sporesList, setSporesList] = useState<QuerySpore[]>([]) 

  const { data: spores, isLoading: isSporesLoading } = useSporesByAddressQuery(
    walletAddress as string,
  );

  const handleSelectSingleGift = (id: string) => {
    const selectedGift = spores.find(gift => gift.id === id);
    if (selectedGift && onSelection) {
      onSelection(selectedGift);
    }
    setSelectedGifts([id]); 
  };
  
  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  useEffect(() => {
    selected ? setSelectedGifts([selected.id]) : ''
  }, [selected])

  useEffect(() => {
    if(storeSporesList && storeSporesList.length != 0) {
      setSporesList(storeSporesList)
      if (hasGift) {
        const selectedSpore = storeSporesList.find(spore => spore.id === hasGift);
        if (selectedSpore && onSelection) {
          onSelection(selectedSpore);
          isGiftSelected(selectedSpore.id);
        }
      }
    }
  }, [storeSporesList, spores])

  return (
    <div className='px-4'>
      <p className='mt-8 text-white001 font-SourceSanPro text-subheadermb'>Select Gift Type</p>
      <div className="my-4 gap-6 flex rounded-md">
        <Tab label="Gift" activeTab={activeTab} onClick={() => setActiveTab('Gift')} />
        <Tab label="Blind Box" activeTab={activeTab} onClick={() => setActiveTab('Blind Box')} />
      </div>
      <p className='mt-8 text-white001 font-SourceSanPro text-subheadermb'>
        {activeTab === "Gift" ? "Select A Gift" : "Select A Blind Box"}
      </p>
      {tab === 'Gift' ? (
          <List
              gifts={sporesList}
              onGiftClick={handleSelectSingleGift}
              isGiftSelected={isGiftSelected}
              viewMode={viewMode}
              interactionType={2}
          />
      ) : (
        <List
            gifts={sporesList}
            onGiftClick={handleSelectSingleGift}
            isGiftSelected={isGiftSelected}
            viewMode={viewMode}
        />
      )}
    {/* <button 
      className="w-full h-12 mb-8 font-PlayfairDisplay border border-white002 text-primary011 bg-white001 py-2 px-4 rounded"
    >
        Next
    </button> */}
    </div>
  );
};

export default Step1;

interface TabProps {
  label: 'Gift' | 'Blind Box';
  activeTab: 'Gift' | 'Blind Box';
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const Tab: React.FC<TabProps> = ({ label, onClick, activeTab }) => { 
  return (
    <button
      className={`flex-1 py-2 text-bd1mb border 
        ${activeTab === label ? 'font-semibold text-white border-2 border-white001' : 'text-white005 border-white005' }`
      }
      onClick={onClick}
    >
      {label}
    </button>
  )
}
