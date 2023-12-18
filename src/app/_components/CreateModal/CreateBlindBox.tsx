import React, { useState } from 'react';
import List from '../List/List';
import { Gift } from '@/types/Gifts';

interface CreateBlindBoxProps {
  onClose: () => void;                // 关闭弹窗的回调函数
  onCreateGift: () => void;           // 创建礼物的回调函数
  onCreateBlindBox: () => void;       // 创建盲盒的回调函数
}

const CreateBlindBox: React.FC<CreateBlindBoxProps> = ({ onClose, onCreateGift, onCreateBlindBox }) => {
  const [title, setTitle] = useState('');
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
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

  const handleSelectGift = (id: string) => {
    setSelectedGifts(prev => 
      prev.includes(id) ? prev.filter(giftId => giftId !== id) : [...prev, id]
    );
  };

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  return (
    <div className="rounded-lg">
        <p className='text-white001 font-SourceSanPro text-labelmb mb-2'>Name your blind box*</p>
        <input 
          className='w-full px-4 py-3 mb-8 bg-primary006 text-white001 rounded-md'
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Blind Box Title" 
        />

        {gifts.length === 0 ? (
          <div>
            <p className='text-white003 font-SourceSanPro text-body1mb'>No Gifts found. <span className='text-primary004 font-SourceSanPro' onClick={onCreateGift}>Create New Gift</span></p>
            <button className="w-full h-12 mt-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" onClick={onCreateBlindBox}>Create Empty Box</button>
          </div>
        ) : (
          <>
            <p className='text-white001 font-SourceSanPro text-body1mb'>Select Gifts to put into this Blind Box</p>
            <div className='max-h-[470px] overflow-auto'>
              <List 
                gifts={gifts} 
                onGiftClick={handleSelectGift}
                isGiftSelected={isGiftSelected}
                viewMode="grid"
              />
            </div>
            <button className="w-full h-12 mt-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" onClick={onCreateBlindBox}>Create Blind Box</button>
          </>
        )}
      </div>
  );
};

export default CreateBlindBox;
