import { ReactElement } from 'react';

export interface WalletModalProps {
  onClose: () => void; 
}

export interface WalletConfig {
  name: string;
  recommended: boolean;
  logo: ReactElement; 
}