import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

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
      <div className="mx-4 relative bg-primary010 p-4 rounded-lg shadow-lg text-white001">
        <CloseIcon onClick={onClose} className="absolute top-4 right-4"/>

        <h2 className="text-xl font-bold mt-6 mb-8 font-Montserrat text-hd3mb">Melt Gifts?</h2>
        <p className=" font-SourceSanPro text-body1mb">After melting the spores, you will be able to get ≈{amount} CKB back in your wallet. This action cannot be undone.</p>
        <div className="flex justify-between mt-4 gap-6">
          <button onClick={onClose} className="text-center flex-1 border border-primary001 py-4 rounded-lg text-buttonmb font-SourceSansPro">Cancel</button>
          <button onClick={onMelt} className="text-center flex-1 border border-primary001 py-4 rounded-lg text-buttonmb font-SourceSansPro bg-white001 text-primary011">Melt</button>
        </div>
      </div>
    </div>
  );
};

export default MeltGiftModal;
