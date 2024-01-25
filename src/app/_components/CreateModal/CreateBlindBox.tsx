import React, { useState } from 'react';
import List from '../List/List';
import { QuerySpore } from '@/hooks/useQuery/type';
import { enqueueSnackbar } from 'notistack';

interface CreateBlindBoxProps {
  onClose: () => void;                
  onCreateGift: () => void;         
  onCreateBlindBox: () => void;
  walletAddress: string;      
}

const CreateBlindBox: React.FC<CreateBlindBoxProps> = ({ onClose, onCreateGift, onCreateBlindBox, walletAddress }) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>();
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

  const isGiftSelected = (id: string) => selectedGifts.includes(id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let errorMessage = '';

    if (value.length > 16) {
      errorMessage = 'Text exceeds the maximum length of 16 characters.';
    } else if (/[^a-zA-Z0-9 ]/.test(value)) {
      errorMessage = 'Text contains special characters.';
    }

    setError(errorMessage);
    setTitle(value);
  }

  const createBlindBox = async () => {
    if (error) return
    const response = await fetch('/api/blindbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'create', key: walletAddress, name: title}),
    });
    const data = await response.json();
    console.log(data)
    if(data.errno !== 200) {
      enqueueSnackbar('Create Blind Box Error', {variant: 'error'})
    } else {
      enqueueSnackbar('Create Blind Box Successful', {variant: 'success'})
    }
    onClose()
  }

  return (
    <div className="rounded-lg">
        <p className='text-white001 font-SourceSanPro text-labelmb mb-2'>Name your Blind Box*</p>
        <input 
          className='w-full px-4 py-3 bg-primary008 text-white001 text-body1mb font-SourceSanPro rounded-md'
          type="text" 
          value={title} 
          onChange={handleChange} 
          placeholder="e.g. Treasure Box" 
        />
        {error && <div className='mt-1 text-light-error-function text-labelmb font-SourceSanPro'>{error}</div>}
        <button 
          disabled={!!error || !title}
          className={`w-full h-12 mt-6 text-buttonmb font-SourceSanPro border border-white002 bg-white001 text-primary011 py-2 px-4 rounded ${(!title || !!error) && 'opacity-50 cursor-not-allowed'}`}
          onClick={createBlindBox}
        >
          Create Blind Box
        </button>
      </div>
  );
};

export default CreateBlindBox;
