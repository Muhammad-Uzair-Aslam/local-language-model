import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatReducer, { ChatState } from './slices/chatSlice';
import modelReducer from './slices/modelSlice';
import authReducer, { authState } from './slices/authSlice';

export interface RootState {
  auth: authState;
  chat: ChatState;
  model: ReturnType<typeof modelReducer>; // Update if modelSlice has a type
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['chat'], // Persist only the chat slice
};

const rootReducer = combineReducers({
  chat: chatReducer,
  model: modelReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;