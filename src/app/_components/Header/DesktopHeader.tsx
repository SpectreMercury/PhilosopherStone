import React, { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "@/store/store";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { setWallet, clearWallet } from '@/store/walletSlice';
import { enqueueSnackbar } from 'notistack';
import useWalletBalance from '@/hooks/useBalance';
import WalletModal from '../WalletModal/WalletModal';
import { useConnect } from '@/hooks/useConnect';
import { fetchGiftAPI } from '@/utils/fetchAPI';
import { RPC } from '@ckb-lumos/rpc';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import unavailableSlice, { setUnavailablelist } from '../../../store/unavailableListSlice';
import { sporeConfig } from '@/utils/config';


const DesktopHeader:React.FC = () => {
  const rpc = new RPC(sporeConfig.ckbNodeUrl);
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
  const [showHeaderModal, setHeaderShowModal] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string>('');
  const { disconnect } = useConnect();
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const walletType = useSelector((state: RootState) => state.wallet.wallet?.walletType);
  const balance = useWalletBalance(walletAddress!!);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  const checkAndRemoveProcessingGifts = async (k: string) => {
    const inProcessingGifts = await fetchGiftAPI({
      action: 'getUnavailableGifts',
      key: k,
    })
    let unavailableSporeIdList:string[] = [];
    if(!inProcessingGifts.data) return;
    await Promise.all(
      Object.keys(inProcessingGifts.data).map(async (txHash: string) => {
        const transaction = await rpc.getTransaction(txHash);
        const transactionStatus = transaction.txStatus.status;
        if (transactionStatus === 'committed') {
          await fetchGiftAPI({
            action: 'removeUnavailableGifts',
            key: k,
            id: txHash
          });
        } else {
          if(inProcessingGifts.data[txHash] !== 'create') {
            unavailableSporeIdList = [...unavailableSporeIdList, inProcessingGifts.data[txHash]];
          }
        }
      })
    )
    dispatch(setUnavailablelist(unavailableSporeIdList));
  }

  const isRouteActive = (route: string) => {
    return pathname === route;
  };

  const backToHome = () => {
    router.push('/');
  }

  const NaviTo = (endpoint: string) => {
    setIsMenuOpen(!isMenuOpen);
    router.push(endpoint)
  }

  const handleDisconnect = () => {
    dispatch(clearWallet());
    localStorage.removeItem('wallet');
    disconnect();
    setIsDropdownVisible(false);
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Address copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Address copied Fail', {variant: 'error'})
    }
  };

  // Click outside will close the dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownVisible(false);
      }
    }
    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);


  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const walletData = JSON.parse(storedWallet);
      dispatch(setWallet(walletData));
    }
  }, [dispatch]);

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    let intervalTask: string | number | NodeJS.Timeout | undefined;
    if (walletAddress) {
      intervalTask = setInterval(() => {
        checkAndRemoveProcessingGifts(walletAddress)
      }, 6000);
    }
    return () => clearInterval(intervalTask);
  }, [walletAddress]);

  return (
    <>
      {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)} />}
      <div className="flex justify-between items-center px-4 py-3 bg-primary011 text-white001 font-SourceSanPro">
        <div 
          className='cursor-pointer'
          onClick={backToHome}
        >
          <Image 
            alt={"logo"}
            src={"/svg/ps-logo-light.svg"}
            width={174}
            height={40}
          />
        </div>
        <div className='flex items-center gap-10'>
          <TabList text='Home' isActive={isRouteActive('/')} onClick={() => NaviTo('/')} />
          {walletAddress && <TabList text='History' isActive={isRouteActive('/history')} onClick={() => NaviTo('/history')} />}
          <TabList text='FAQ' isActive={isRouteActive('/FAQ')} onClick={() => NaviTo('/FAQ')} />
          <TabList text='Claim Gift' isActive={isRouteActive('/zhimakaimen')} onClick={() => NaviTo('/zhimakaimen')} />
          <div 
            className='cursor-pointer relative px-4 py-2 bg-primary010 flex items-center text-white001 rounded'
            onClick={toggleDropdown}
          >
            {walletAddress ?
              <>
                {walletType === 'JoyID' ? 
                  <Image 
                    alt='wallet-icon'
                    src='/svg/joyid-icon.svg'
                    width={24}
                    height={24}
                  />:
                  <Image 
                    alt='wallet-icon'
                    src='/svg/metamask-icon.svg'
                    width={24}
                    height={24}
                  />
                }
                <p className='ml-4'>{balance.toLocaleString()} CKB</p>
              </>
            : 
              <div 
                className='font-SourceSanPro text-buttonmb'
                onClick={() => {setHeaderShowModal(true)}}
              >
                Log in
              </div>
            }
            {isDropdownVisible && walletAddress && (
              <div 
                ref={dropdownRef} 
                className='absolute top-full right-0 rounded bg-primary010 min-w-[320px] z-50 border-white009 cursor-default'
                style={{boxShadow: '0px -2px 6px 0px rgba(0, 0, 0, 0.16)'}}
              >
                <div className='flex flex-col items-center pt-6'>
                    <div className='text-white001 font-SourceSanPro text-body1bdmb'>My wallet</div>
                    <div className='flex gap-2 mt-2'>
                      {walletType === 'JoyID' ? 
                        <Image 
                          alt='wallet-icon'
                          src='/svg/joyid-icon.svg'
                          width={18}
                          height={18}
                        />:
                        <Image 
                          alt='wallet-icon'
                          src='/svg/metamask-icon.svg'
                          width={18}
                          height={18}
                        />
                      }
                      <div className='text-white001 font-SourceSanPro text-labelmb'>{walletAddress.slice(0, 10)}...{walletAddress.slice(walletAddress.length - 10, walletAddress.length)}</div>
                    </div>
                    <div className='text-white001 font-Montserrat text-hd3mb mt-4'>{balance.toLocaleString()} CKB</div>
                  </div>
                  <div className='flex justify-center items-center gap-12 mt-8 pb-8'>
                    <div className='flex flex-col gap-2 items-center'>
                      <button className='w-8 h-8 bg-primary008 rounded-full flex justify-center items-center' onClick={() => {handleCopy(walletAddress)}}>
                        <Image
                          src='/svg/icon-copy.svg'
                          width={18}
                          height={18}
                          alt='Copy address'
                        />
                      </button>
                      <p className='text-white001 font-SourceSanPro text-labelmb'>Copy</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                      <button className='w-8 h-8 bg-primary008 rounded-full flex justify-center items-center' onClick={() => NaviTo('/withdraw')}>
                        <Image
                          src='/svg/icon-withdraw.svg'
                          width={18}
                          height={18}
                          alt='Withdraw'
                        />
                      </button>
                      <p className='text-white001 font-SourceSanPro text-labelmb'>Withdraw</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                      <button className='w-8 h-8 bg-primary008 rounded-full flex justify-center items-center' onClick={handleDisconnect}>
                        <Image
                          src='/svg/icon-logout.svg'
                          width={18}
                          height={18}
                          alt='Log out'
                        />
                      </button>
                      <p className='text-white001 font-SourceSanPro text-labelmb'>Log out</p>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopHeader;

interface TabListProps {
  text: 'Home' | 'History'| 'FAQ' | 'Claim Gift';
  onClick: MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
}

const TabList: React.FC<TabListProps> = ({ text, onClick, isActive }) => { 
  return (
    <div 
      className={`flex items-center gap-2 py-1 ${isActive? 'text-white001 text-body1bdmb cursor-default': 'text-white005 text-body1mb cursor-pointer hover:underline'}`} 
      onClick={onClick}
    >
      {text}
      {text === 'Claim Gift' && 
        <Image 
          src="/svg/icon-dragon.svg"
          alt='Event to claim New Year Gift'
          width={24}
          height={24}
        />
      }
  </div>
  )
}
