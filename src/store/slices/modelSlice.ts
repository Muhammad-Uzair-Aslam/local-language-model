import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModelState {
  isDownloaded: boolean;
  isModelLoaded: boolean;
  progress: number;
}

const initialState: ModelState = {
  isDownloaded: false,
  isModelLoaded: false,
  progress: 0,
};

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setDownloadProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setModelDownloaded: (state, action: PayloadAction<boolean>) => {
      state.isDownloaded = action.payload;
    },
    setModelLoaded: (state, action: PayloadAction<boolean>) => {
      state.isModelLoaded = action.payload;
    },
  },
});

export const { setDownloadProgress, setModelDownloaded, setModelLoaded } = modelSlice.actions;
export default modelSlice.reducer;
