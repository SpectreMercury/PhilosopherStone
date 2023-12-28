import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Close from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { setWallet, clearWallet } from '@/store/walletSlice';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import useWalletBalance from '@/hooks/useBalance';
import WalletModal from '../WalletModal/WalletModal';
import { kv } from '@vercel/kv';


const Header:React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>('');
  const [showHeaderModal, setHeaderShowModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch()
  const pathname = usePathname()
  const walletAddress = useSelector((state: RootState) => state.wallet.wallet?.address);
  const balance = useWalletBalance(walletAddress!!)
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
  };

  async function callSaveAction(key: string, value: Object) {
    const response = await fetch('/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'save', key, value }),
    });
    const data = await response.json();
    return data;
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };


  useEffect(() => {
    callSaveAction('1', {'giftMessage': '1'})
  }, [])

  return (
    <div className='flex flex-col'>
      {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)} />}

      <div 
        className="flex justify-between items-center px-4 py-3 bg-primary011 text-white"
      >
        <div 
          className='bg-primary010 font-PlayfairDisplay font-bold cursor-pointer px-4 py-2 bg-surface03 rounded-md'
          onClick={backToHome}
        >
          Philosopher Stone
        </div>
        <div className="cursor-pointer flex space-y-2 bg-primary010 w-10 h-10 rounded-md items-center justify-center" onClick={toggleMenu}>
          {isMenuOpen ? <Close className='text-white001 h-6 w-6' /> : <MenuIcon className='text-white001 h-6 w-6' />}
        </div>
      </div>
      {
        isMenuOpen && (
          <div className='absoulte bg-primary011 w-full top-16 flex flex-col justify-between' style={{ height: `calc(100vh - 64px)`}}>
            <div className='px-4'>
              <div className={`mt-4 cursor-pointer ${isRouteActive('/') ? 'text-white001': 'text-white005'} h-11 text-body1mb`}>Create Gift & Blind Box</div>
              <div className={`cursor-pointer ${isRouteActive('/send') ? 'text-white001': 'text-white005'} h-11 text-body1mb`} onClick={() => {NaviTo('/send')}}>Send Gift</div>
              <div className={`cursor-pointer ${isRouteActive('/my') ? 'text-white001': 'text-white005'} h-11 text-body1mb`}>My Box</div>
              <div className={`cursor-pointer ${isRouteActive('/history') ? 'text-white001': 'text-white005'} h-11 text-body1mb`}>History</div>
            </div>
            <div className='px-4 border-t'>
              {
                walletAddress ? (<>
                  <div className='flex justify-between py-4'>
                    <div className='text-white001 font-semibold font-SourceSanPro text-hd3mb'>My Wallet</div>
                    <div className='text-white001 font-semibold font-SourceSanPro'>{balance} CKB</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex gap-2'>
                      <Image 
                        alt='wallet-icon'
                        src='/svg/joyid-icon.svg'
                        width={24}
                        height={24}
                      />
                      <div className='text-white001 text-labelmb'>{walletAddress.slice(0, 10)}...{walletAddress.slice(walletAddress.length - 10, walletAddress.length)}</div>
                    </div>
                    <ContentCopyIcon className='text-white001 cursor-pointer' 
                      onClick={() => {handleCopy(walletAddress)}}
                    />
                  </div>
                  <div 
                    className='border justify-center h-12 my-4 flex items-center rounded-md cursor-pointer text-white001'
                    onClick={handleDisconnect}
                  >
                    
                    Disconnect
                  </div>
                </>) : (<>
                  <div 
                    className='border justify-center h-12 my-4 flex items-center rounded-md cursor-pointer text-white001'
                    onClick={() => {setHeaderShowModal(true)}}
                  >
                    Connect Wallet
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
