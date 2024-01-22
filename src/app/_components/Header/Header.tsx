import React, { useState, useEffect, MouseEventHandler } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Close from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
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

  let queryString = '';
  searchParams.forEach((value, key) => {
    if (queryString !== '') {
      queryString += '&';
    }
    queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  });

  const fullPath = `${pathname}?${queryString}`;

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
    return fullPath === route;
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

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied Successful', {variant: 'success'})
    } catch (err) {
      enqueueSnackbar('Copied Fail', {variant: 'error'})
    }
  };

  return (
    <div className='flex flex-col'>
      {showHeaderModal && <WalletModal onClose={() => setHeaderShowModal(false)} />}
      <div 
        className="flex justify-between items-center px-4 py-3 bg-primary010 text-white"
      >
        <div 
          className='cursor-pointer'
          onClick={backToHome}
        >
          <Image 
            alt={"logo"}
            src={"/svg/ps-logo.svg"}
            width={40}
            height={40}
          />
        </div>
        <div className="cursor-pointer flex space-y-2 bg-primary008 w-10 h-10 rounded-md items-center justify-center" onClick={toggleMenu}>
          {isMenuOpen ? <Close className='text-white001 h-6 w-6' /> : <MenuIcon className='text-white001 h-6 w-6' />}
        </div>
      </div>
      {
        isMenuOpen && (
          <div className='absoulte bg-primary010 w-full top-16 flex flex-col justify-between' style={{ height: `calc(100vh - 64px)`}}>
            <div className='px-4 mt-4'>
              <MenuList text={"Create Gift"} isActive={isRouteActive('/my?type=Gift')} onClick={() => NaviTo('/my?type=Gift')} />
              <MenuList text={"Create BlindBox"} isActive={isRouteActive('/my?type=Blind Box')} onClick={() => NaviTo('/my?type=Blind Box')} />
              <MenuList text={"FAQ"} isActive={isRouteActive('/')} onClick={() => NaviTo('/')} />
            </div>
            <div className='px-4 border-t border-white009'>
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
                    className='border justify-center h-12 my-8 flex items-center rounded-md cursor-pointer text-white001'
                    onClick={handleDisconnect}
                  >
                    
                    Log out
                  </div>
                </>) : (<>
                  <div 
                    className='border justify-center h-12 my-8 flex items-center rounded-md cursor-pointer text-white001'
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
      className={`h-11 cursor-pointer flex gap-4 ${isActive? 'text-white005': 'text-white005'} text-body1mb items-center`} 
      onClick={onClick}
    >
      {text}
      {/* {isActive && 
        <Image 
          alt='active tab'
          src='/svg/icon-star.svg'
          width={24}
          height={24}
        />
      } */}
  </div>
  )
}