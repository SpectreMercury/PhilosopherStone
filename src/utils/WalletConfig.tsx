import Image from 'next/image';
import { WalletConfig } from "@/types/Wallet";

const WalletConfigData: WalletConfig[] = [
  {
    name: 'Metamask',
    recommended: false,
    logo: <Image src='/svg/metamask-icon.svg' alt='Metamask' width={24} height={24} />,
  },
  // {
  //   name: 'JoyID',
  //   recommended: false,
  //   logo: <Image src='/svg/joyid-icon.svg' alt='JoyID' width={24} height={24} />,
  // },
];

export default WalletConfigData;