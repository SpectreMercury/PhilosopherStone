import React from 'react';
import WalletConfigData from '@/utils/WalletConfig';
import { WalletModalProps } from '@/types/Wallet';
import { connect as joyIdConnect } from '@joyid/evm';
import { useDispatch } from 'react-redux';
import { setWallet } from '@/store/walletSlice';
import {
  Script,
  Transaction,
  commons,
  config,
  helpers,
} from '@ckb-lumos/lumos';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { connect as MetamaskConnect } from '@wagmi/core';
import { useConnect } from '@/hooks/useConnect';

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {

  const dispatch = useDispatch()
  const { connect } = useConnect()

  const setAddress = (address: string) => {
    config.initializeConfig(config.predefined.AGGRON4)
    const lock = commons.omnilock.createOmnilockScript({
      auth: {flag: 'ETHEREUM', content: address ?? '0x'},
    },{ config: config.predefined.AGGRON4 })

    const ckbAddress = helpers.encodeToAddress(lock, {
      config: config.predefined.AGGRON4
    })
    return ckbAddress
  }
  
  const connectJoyID = async () => {
    try {
      const authData = await joyIdConnect()
      const ckbAddress = setAddress(authData)
      dispatch(setWallet({
        address: ckbAddress,
        ethAddress: authData, 
        walletType: 'JoyID'
      }))
      onClose()
    } catch(error) {
      console.log(error)
    }
  }

  const setMeskAddress = (ethAddress: `0x${string}` | undefined) => {
    config.initializeConfig(config.predefined.AGGRON4);
    const lock = commons.omnilock.createOmnilockScript({
      auth: { flag: 'ETHEREUM', content: ethAddress ?? '0x' },
    });
    const address = helpers.encodeToAddress(lock, {
      config: config.predefined.AGGRON4,
    });
    dispatch(setWallet({
      address: address,
      ethAddress: ethAddress, 
      walletType: 'MetaMask'
    }))
    onClose()
  }

  const connectWallet = async (name: string) => {
    if (name === 'JoyID') {
      connectJoyID()
    }

    if (name === 'Metamask') {
      let connectors = connect()
      connectors!![1].connect()
    }
  }


  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-primary010 p-6 rounded-lg z-10 shadow-md border border-white009">
          <button className="text-white001 close-button float-right" onClick={onClose}>X</button>
          <h1 className="text-xl mb-2 text-white001 text-hd3mb font-Montserrat">Connect Wallet</h1>
          <p className="mb-4 text-body1mb font-SourceSanPro text-white003">If you don&apos;t have a wallet yet, you can select a provider and create one now.</p>
          <div className="flex flex-col space-y-2">
            {WalletConfigData.map((wallet, index) => (
              <button key={index} className="hover:bg-white009 w-full flex justify-between items-center py-3 px-6 border border-white009 text-white rounded" onClick={() => {connectWallet(wallet.name)}}>
                <div className='flex gap-2'>
                    <div className="flex-shrink-0">
                        {wallet.logo}
                    </div>
                    <span className="flex-grow text-body1mb font-SourceSansPro ml-2">{wallet.name}</span>
                </div>
                {wallet.recommended && (
                <span className="ml-2 bg-primary006 text-white text-labelmb font-SourceSansPro rounded-sm px-2 py-1">
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
