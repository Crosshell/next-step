'use client';
import { useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import RoleFormItem from './RoleFormItem';
import CreateAccountItem from './CreateAccountItem';
import ConfirmBoxItem from './ConfirmBoxItem';

import classes from './SignUpItems.module.css';

import { PartialRegistrationFormData } from '@/types/authForm';

import { AppDispatch, RootState } from '@/store/store';
import {
  changeRegFormData,
  deleteRegFormData,
  stepUp,
} from '@/store/slices/signUpSlice';

export default function RegistrationForm() {
  const dispatch = useDispatch<AppDispatch>();

  const currentStep = useSelector(
    (state: RootState) => state.signUp.currentStep
  );

  const stepUpHandler = () => {
    dispatch(stepUp());
  };

  const deleteRegData = useCallback(() => {
    dispatch(deleteRegFormData());
  }, [dispatch]);

  const changeFormData = (accountData: PartialRegistrationFormData) => {
    dispatch(changeRegFormData(accountData));
  };

  const handleChangeFormData = (accountData: PartialRegistrationFormData) => {
    changeFormData(accountData);
    stepUpHandler();
  };

  useEffect(() => {
    deleteRegData();
  }, [deleteRegData]);

  return (
    <div className={classes['sign-up-container']}>
      <AnimatePresence>
        {currentStep === 'role' && (
          <RoleFormItem onRoleSelect={handleChangeFormData} />
        )}
        {currentStep === 'account' && <CreateAccountItem />}
        {currentStep === 'confirm' && <ConfirmBoxItem />}{' '}
      </AnimatePresence>
    </div>
  );
}
