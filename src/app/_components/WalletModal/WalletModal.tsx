import React from 'react';
import WalletConfigData from '@/utils/WalletConfig';
import { WalletModalProps } from '@/types/Wallet';
import { useConnect } from '@/hooks/useConnect';
import Image from 'next/image';

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { connect } = useConnect()

  const connectWallet = async (name: string) => {
    if (name === 'JoyID') {
      // connectJoyID()
      let connectors = connect()
      connectors!![0].connect()
      onClose()
    }

    if (name === 'Metamask') {
      let connectors = connect()
      connectors!![1].connect()
      onClose()
    }
  }


  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-primary010 p-6 rounded-lg z-10 shadow-md border border-white009">
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-white001 text-hd3mb font-Montserrat'>Log in</h3>
            <button onClick={onClose}>
              <Image 
                src='/svg/icon-x.svg'
                width={24}
                height={24}
                alt='close modal'
              />
            </button>
          </div>
          <p className="mb-4 text-body1mb font-SourceSanPro text-white003">If you don&apos;t have a wallet yet, you can select a provider and create one now.</p>
          <div className="flex flex-col space-y-6">
            {WalletConfigData.map((wallet, index) => (
              <button key={index} className="hover:bg-white009 w-full flex justify-between items-center py-3 px-6 border border-white001 text-white001 rounded" onClick={() => {connectWallet(wallet.name)}}>
                <div className='flex gap-2'>
                    <div className="flex-shrink-0">
                        {wallet.logo}
                    </div>
                    <span className="flex-grow text-body1mb font-SourceSanPro ml-2">{wallet.name}</span>
                </div>
                {wallet.recommended && (
                <span className="ml-2 bg-primary006 text-white text-labelmb font-SourceSanPro rounded-sm px-2 py-1">
                    Recommended
                </span>
                )}
            </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletModal;
