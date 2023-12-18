import React, { useState } from 'react';
import Image from 'next/image';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import CheckIcon from '@mui/icons-material/Check';
import List from './List';


interface Gift {
  id: string;
  name: string;
  occupid: string;
  image: string;
}

interface GiftListProps {
  onNewGiftClick?: () => void;
}

const GiftList: React.FC<GiftListProps> = ({ onNewGiftClick }) => {
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

  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  return (
    <div className='mb-8'>
      <div className='mt-4 flex gap-8 justify-between items-center'>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 rounded-full bg-primary006"
            placeholder="Search gifts..."
        />
        <div className="text-primary003 font-SourceSanPro text-body1mb" onClick={onNewGiftClick}>+ New Gift</div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className='text-white001'>{gifts.length} Gifts</span>
          <button className="ml-2 text-primary004">Select All</button>
        </div>
        <div onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
          <TableRowsIcon className='text-white001'/>
        </div>
      </div>

      <List
        gifts={gifts}
        onGiftClick={handleSelectGift}
        isGiftSelected={isGiftSelected}
        viewMode={viewMode}
      />
    </div>
  );
};

export default GiftList;
