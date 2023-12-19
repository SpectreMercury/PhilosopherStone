import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WalletInfo {
  address: string;
  pubkey?: string;  
  walletType: 'JoyID' | 'MetaMask';
}

interface WalletState {
  wallet: WalletInfo | null;
}

const initialState: WalletState = {
  wallet: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet(state, action: PayloadAction<WalletInfo>) {
      state.wallet = action.payload;
    },
    clearWallet(state) {
      state.wallet = null;
    },
  },
});

export const { setWallet, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
