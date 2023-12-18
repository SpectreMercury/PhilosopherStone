import React, { useState } from 'react';
import GiftList from '@/app/_components/List/GiftList'; // 确保路径正确
import List from '../List/List';
import { Gift } from '@/types/Gifts';

const Step1: React.FC = () => {
  const [tab, setTab] = useState<'Gift' | 'Spore'>('Gift');
  const [gifts, setGifts] = useState<Gift[]>([
        {"id": "0", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "1", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "2", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "3", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "4", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "5", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "6", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "7", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "8", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"},
        {"id": "9", "name": "0x38910...2029", "occupid": "1000", "image": "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png"}
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Gift' | 'Blind Box'>('Gift');
  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

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
            gifts={gifts}
            onGiftClick={handleSelectGift}
            isGiftSelected={isGiftSelected}
            viewMode={viewMode}
        />
      ) : (
        <List
            gifts={gifts}
            onGiftClick={handleSelectGift}
            isGiftSelected={isGiftSelected}
            viewMode={viewMode}
        />
      )}
    </div>
  );
};

export default Step1;
