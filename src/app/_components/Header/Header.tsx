import React, { useState, useEffect, MouseEventHandler } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { setWallet, clearWallet } from '@/store/walletSlice';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import useWalletBalance from '@/hooks/useBalance';
import WalletModal from '../WalletModal/WalletModal';
import { kv } from '@vercel/kv';
import { useConnect } from '@/hooks/useConnect';
import { fetchGiftAPI } from '@/utils/fetchAPI';
import { RPC } from '@ckb-lumos/rpc';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import { Transaction } from '@ckb-lumos/lumos';
import unavailableSlice, { setUnavailablelist } from '../../../store/unavailableListSlice';
import { sporeConfig } from '@/utils/config';


const Header:React.FC = () => {
  const rpc = new RPC(sporeConfig.ckbNodeUrl);
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>('');
  const [showHeaderModal, setHeaderShowModal] = useState(false);
  const { disconnect } = useConnect();
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const walletType = useSelector((state: RootState) => state.wallet.wallet?.walletType);
  const balance = useWalletBalance(walletAddress!!);
  
  const toggleMenu = () => {
    if (!isMenuOpen) {
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
    setIsMenuOpen(!isMenuOpen);
  }

  const checkAndRemoveProcessingGifts = async (k: string) => {
    const inProcessingGifts = await fetchGiftAPI({
      action: 'getUnavailableGifts',
      key: k,
    })
    let unavailableSporeIdList:string[] = [];
    if(!inProcessingGifts.data) return;
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
        if(inProcessingGifts.data.txHash !== 'create') {
          unavailableSporeIdList.push(inProcessingGifts.data.txHash);
        }
      }
    })
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
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };

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
    let intervalTask
    if(walletAddress) {
      intervalTask = setInterval(() => {
        checkAndRemoveProcessingGifts(walletAddress)
      }, 6000)
    }
    return clearInterval(intervalTask);
  }, [walletAddress])

  // Prevent users from scrolling the page when menu is opened
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isMenuOpen) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMenuOpen]);

  return (
    <div className='flex flex-col sticky top-0 z-50'>
      {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)} />}
      <div 
        className="flex justify-between items-center px-4 py-3 bg-primary011 text-white001"
      >
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
        <div className="cursor-pointer flex space-y-2 bg-primary008 w-10 h-10 rounded-md items-center justify-center" onClick={toggleMenu}>
          {isMenuOpen ? 
            <Image 
              src='/svg/icon-x.svg'
              width={24}
              height={24}
              alt='Close menu'
            />
            :
            <Image 
              src='/svg/icon-menu.svg'
              width={24}
              height={24}
              alt='Open modal'
            />
          }
        </div>
      </div>
      {
        isMenuOpen && (
          <div 
            className='absoulte bg-primary011 w-full top-16 flex flex-col justify-between'
            style={{ 
              minHeight: 'calc(100vh - 64px)', 
              paddingBottom: 'env(safe-area-inset-bottom, 20px)'
            }}
          >
            <div className='px-4 mt-4'>              
              <MenuList text={"Home"} isActive={isRouteActive('/')} onClick={() => NaviTo('/')} />
              {walletAddress && <MenuList text={"History"} isActive={isRouteActive('/history')} onClick={() => NaviTo('/history')} />}
              <MenuList text={"FAQ"} isActive={isRouteActive('/FAQ')} onClick={() => NaviTo('/FAQ')} />
            </div>
            <div className='px-4 border-t border-white009 sticky bottom-0'>
              {
                walletAddress ? (<>
                  <div className='flex justify-between py-4'>
                    <div className='text-white001 font-SourceSanPro text-subheadermb'>My Wallet</div>
                    <div className='text-white001 font-SourceSanPro text-subheadermb'>{balance} CKB</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex gap-2'>
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
                      <div className='text-white001 font-SourceSanPro text-labelmb'>{walletAddress.slice(0, 10)}...{walletAddress.slice(walletAddress.length - 10, walletAddress.length)}</div>
                    </div>
                    <button onClick={() => {handleCopy(walletAddress)}}>
                      <Image
                        src='/svg/icon-copy.svg'
                        width={18}
                        height={18}
                        alt='Copy address'
                      />
                    </button>
                  </div>
                  <div 
                    className='border justify-center h-12 my-8 flex items-center rounded-md cursor-pointer text-white001 font-SourceSanPro'
                    onClick={handleDisconnect}
                  >
                    
                    Log out
                  </div>
                </>) : (<>
                  <div 
                    className='border justify-center h-12 my-8 flex items-center rounded-md cursor-pointer text-white001 font-SourceSanPro'
                    onClick={() => {setHeaderShowModal(true)}}
                  >
                    Log in
                  </div>
                </>)
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Header;

interface MenuListProps {
  text: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ text, onClick, isActive }) => { 
  return (
    <div 
      className={`h-11 cursor-pointer flex gap-4 ${isActive? 'text-white001 font-bold': 'text-white005'} text-body1mb items-center`} 
      onClick={onClick}
    >
      {text}
      {isActive && 
        <Image 
          alt='active tab'
          src='/svg/icon-star.svg'
          width={24}
          height={24}
        />
      }
  </div>
  )
}
