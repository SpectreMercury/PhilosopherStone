import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface WithOnCloseProp {
  onClose?: () => void;
}

const CreateModal: React.FC<ModalProps> = ({ title, onClose, children }) => {

  const childrenWithClose = React.Children.map(children, child => 
    React.isValidElement<WithOnCloseProp>(child) 
      ? React.cloneElement(child, { onClose }) 
      : child
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="w-full bg-primary010 border border-white008 mx-4 px-4 py-6 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <p className='text-white001 text-hd3mb font-semibold font-PlayfairDisplay'>{title}</p>
          <button className='text-white001 text-hd3mb font-semibold font-PlayfairDisplay' onClick={onClose}>
            <CloseIcon className='text-white001' />
          </button>
        </div>
        {childrenWithClose}
      </div>
    </div>
  );
};

export default CreateModal;

