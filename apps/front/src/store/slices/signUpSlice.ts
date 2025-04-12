import { RegistrationFormData } from '@/types/authForm';
import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  signUpSteps: string[];
  currentStep: string;
  regFormData: RegistrationFormData;
}

const initialState: ModalState = {
  signUpSteps: ['role', 'account', 'confirm', 'profile'],
  currentStep: 'role',
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
    stepUp: (state) => {
      state.currentStep =
        state.signUpSteps[state.signUpSteps.indexOf(state.currentStep) + 1];
    },
    stepBack: (state) => {
      state.currentStep =
        state.signUpSteps[state.signUpSteps.indexOf(state.currentStep) - 1];
    },
    changeRegFormData: (state, action) => {
      state.regFormData = { ...state.regFormData, ...action.payload };
    },
    deleteRegFormData: (state) => {
      state.regFormData = { ...initialState.regFormData };
    },
  },
});

export const { stepUp, stepBack, changeRegFormData, deleteRegFormData } =
  signUpSlice.actions;

export default signUpSlice.reducer;
