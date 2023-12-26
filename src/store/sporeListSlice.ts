import { QuerySpore } from '@/hooks/useQuery/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SporesState {
  spores: QuerySpore[] | null;
}

const initialState: SporesState = {
  spores: null,
};

const sporesSlice = createSlice({
  name: 'spores',
  initialState,
  reducers: {
    setSpores(state, action: PayloadAction<QuerySpore[]>) {
      state.spores = action.payload;
    },
    clearSpores(state) {
      state.spores = null;
    },
  },
});

export const { setSpores, clearSpores } = sporesSlice.actions;
export default sporesSlice.reducer;
