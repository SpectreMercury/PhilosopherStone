import React, { useEffect, useState } from 'react';
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
    console.log(selected)
    selected ? setSelectedGifts([selected.id]) : ''
  }, [selected])

  useEffect(() => {
    if(storeSporesList && storeSporesList.length != 0) {
      setSporesList(storeSporesList)
      if (hasGift) {
        console.log(hasGift)
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
      <div className="my-4 flex rounded-md bg-primary011">
        <button
          className={`flex-1 py-2 m-1 font-semibold text-white font-SourceSanPro ${activeTab === 'Gift' ? 'bg-primary010' : ''} rounded-md`}
          onClick={() => setActiveTab('Gift')}
        >
          Gift
        </button>
        <button
          className={`flex-1 py-1 m-1 font-semibold text-white font-SourceSanPro ${activeTab === 'Blind Box' ? 'text-blue-500 bg-primary010' : ''} rounded-md `}
          onClick={() => setActiveTab('Blind Box')}
        >
          Blind Box
        </button>
      </div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="px-4 py-3 rounded-full bg-primary006"
        placeholder="Search..."
      />

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
