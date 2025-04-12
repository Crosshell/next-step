import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import signUpReducer from './slices/signUpSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    signUp: signUpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
