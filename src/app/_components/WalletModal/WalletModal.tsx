import React from 'react';
import WalletConfigData from '@/utils/WalletConfig';
import { WalletModalProps } from '@/types/Wallet';
import { connect } from '@joyid/evm';
import { useDispatch } from 'react-redux';
import { setWallet } from '@/store/walletSlice';
import { BI, Transaction, commons, config, helpers } from '@ckb-lumos/lumos';


const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {

  const dispatch = useDispatch()

  const setAddress = (address: string) => {
    config.initializeConfig(config.predefined.AGGRON4)
    const lock = commons.omnilock.createOmnilockScript({
      auth: {flag: 'ETHEREUM', content: address ?? '0x'}
    })
    const ckbAddress = helpers.encodeToAddress(lock, {
      config: config.predefined.AGGRON4
    })
    return ckbAddress
  }
  const connectJoyID = async () => {
    try {
      const authData = await connect()
      const ckbAddress = setAddress(authData)
      dispatch(setWallet({
        address: ckbAddress,
        ethAddress: authData, 
        walletType: 'JoyID'
      }))
      // console.log('JoyID info:', authData);
      console.log('authdata', authData);
      onClose()
    } catch(error) {
      console.log(error)
    }
  }

  const connectWallet = (name: string) => {
    if (name === 'JoyID') {
      connectJoyID()
    }

    if (name === 'Metamask') {
      console.log(name)
    }
  }


  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-primary010 p-6 rounded-lg z-10 shadow-md border border-white009">
          <button className="text-white001 close-button float-right" onClick={onClose}>X</button>
          <h1 className="text-xl font-bold mb-2 text-white001 font-PlayfairDisplay">Connect Wallet</h1>
          <p className="mb-4 font-SourceSanPro text-white001">If you dont have a wallet yet, you can select a provider and create one now.</p>
          <div className="flex flex-col space-y-2">
            {WalletConfigData.map((wallet, index) => (
              <button key={index} className="hover:bg-white009 w-full flex justify-between items-center py-3 px-6 border border-white009 text-white rounded" onClick={() => {connectWallet(wallet.name)}}>
                <div className='flex gap-2'>
                    <div className="flex-shrink-0">
                        {wallet.logo}
                    </div>
                    <span className="flex-grow ml-2">{wallet.name}</span>
                </div>
                {wallet.recommended && (
                <span className="ml-2 bg-primary006 text-white text-xs rounded-sm px-2 py-1">
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
