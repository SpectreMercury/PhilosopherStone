import Image from 'next/image';
import { WalletConfig } from "@/types/Wallet";

let WalletConfigData: WalletConfig[] = [
  {
    name: 'JoyID',
    recommended: false,
    logo: <Image src='/svg/joyid-icon.svg' alt='JoyID' width={24} height={24} />,
  }
];

// WalletConfigData = process.env.NODE_ENV === 'development' ? [...WalletConfigData, {
//   name: 'JoyID',
//   recommended: false,
//   logo: <Image src='/svg/joyid-icon.svg' alt='JoyID' width={24} height={24} />,
// },] : WalletConfigData


export default WalletConfigData;