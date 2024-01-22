import React from 'react';
import Image from 'next/image';

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
      <div className="w-full max-w-lg bg-primary010 border border-white008 mx-4 px-4 py-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <p className='text-white001 text-hd3mb font-Montserrat'>{title}</p>
          <button className='text-white001 text-hd3mb font-Montserrat' onClick={onClose}>
            <Image 
              src='/svg/icon-x.svg'
              width={24}
              height={24}
              alt='Close modal'
            />
          </button>
        </div>
        {childrenWithClose}
      </div>
    </div>
  );
};

export default CreateModal;

