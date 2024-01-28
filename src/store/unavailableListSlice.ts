import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface unavailableList {
  list: string[] | null;
}

const initialState: unavailableList = {
  list: [],
};

const unavailableSlice = createSlice({
  name: 'spores',
  initialState,
  reducers: {
    setUnavailablelist(state, action: PayloadAction<string[]>) {
      state.list = action.payload;
    }
  },
});

export const { setUnavailablelist } = unavailableSlice.actions;
export default unavailableSlice.reducer;
