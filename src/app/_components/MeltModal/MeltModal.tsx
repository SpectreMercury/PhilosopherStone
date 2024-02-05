import React from 'react';
import Image from 'next/image';
import Button from '@/app/_components/Button/Button';

interface MeltGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMelt: () => void;
  amount: string;
}

const MeltGiftModal: React.FC<MeltGiftModalProps> = ({ isOpen, onClose, onMelt, amount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="mx-4 relative bg-primary010 px-4 py-6 rounded-lg shadow-lg text-white001">
        <div className='flex items-center justify-between mb-6'>
          <h2 className="font-Montserrat text-hd3mb">Melt Gifts into CKB?</h2>
          <button onClick={onClose}>
            <Image 
              src='/svg/icon-x.svg'
              width={24}
              height={24}
              alt='Close modal'
            />
          </button>
        </div>
        <p className="font-SourceSanPro text-body1mb">
          After melting the gifts, you will be able to get ≈{amount} CKB back in your wallet. This action cannot be undone.
        </p>
        <div className="flex justify-between mt-4 gap-6">
          <Button type='outline' label='Cancel' onClick={onClose} />
          <Button type='solid' label='Melt' onClick={onMelt} />
        </div>
      </div>
    </div>
  );
};

export default MeltGiftModal;
