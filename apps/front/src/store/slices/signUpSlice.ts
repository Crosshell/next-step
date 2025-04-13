import { RegistrationFormData } from '@/types/authForm';
import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  regFormData: RegistrationFormData;
}

const initialState: ModalState = {
  regFormData: {
    role: '',
    email: '',
    password: '',
    confirm: '',
  },
};

const signUpSlice = createSlice({
  name: 'regForm',
  initialState,
  reducers: {
    changeRegFormData: (state, action) => {
      state.regFormData = { ...state.regFormData, ...action.payload };
    },
    deleteRegFormData: (state) => {
      state.regFormData = { ...initialState.regFormData };
    },
  },
});

export const { changeRegFormData, deleteRegFormData } = signUpSlice.actions;

export default signUpSlice.reducer;
