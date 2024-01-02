import React, { useState } from 'react';
import List from '../List/List';
import { QuerySpore } from '@/hooks/useQuery/type';

interface CreateBlindBoxProps {
  onClose: () => void;                
  onCreateGift: () => void;         
  onCreateBlindBox: () => void;
  walletAddress: string;      
}

const CreateBlindBox: React.FC<CreateBlindBoxProps> = ({ onClose, onCreateGift, onCreateBlindBox, walletAddress }) => {
  const [title, setTitle] = useState('');
  const [gifts, setGifts] = useState<QuerySpore[]>();
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

  const isGiftSelected = (id: string) => selectedGifts.includes(id);

  const createBlindBox = async () => {
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'create', key: walletAddress, name: title}),
    });
    const data = await response.json();
  }

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

        <button className="w-full h-12 mt-8 font-PlayfairDisplay border border-white002 bg-white001 text-primary011 py-2 px-4 rounded" onClick={createBlindBox}>Create Blind Box</button>
      </div>
  );
};

export default CreateBlindBox;
