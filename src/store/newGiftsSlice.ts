import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewGiftsState {
  newGifts: string[];
}

const initialState: NewGiftsState = {
  newGifts: [],
};

const newGiftsSlice = createSlice({
  name: 'newGifts',
  initialState,
  reducers: {
    setNewGifts(state, action: PayloadAction<string[]>) {
      state.newGifts = action.payload;
    },
    clearNewGifts(state) {
      state.newGifts = [];
    },
    addNewGift(state, action: PayloadAction<string>) {
      state.newGifts.push(action.payload);
    },
  },
});

export const { setNewGifts, clearNewGifts, addNewGift } = newGiftsSlice.actions;
export default newGiftsSlice.reducer;
