'use client';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';

import RoleFormItem from './RoleFormItem';
import CreateAccountItem from './CreateAccountItem';
import ConfirmBoxItem from './ConfirmBoxItem';

import classes from './SignUpItems.module.css';

import { AppDispatch } from '@/store/store';
import { deleteRegFormData } from '@/store/slices/signUpSlice';

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step');

  const dispatch = useDispatch<AppDispatch>();

  const deleteRegData = useCallback(() => {
    dispatch(deleteRegFormData());
  }, [dispatch]);

  useEffect(() => {
    deleteRegData();
  }, [deleteRegData]);

  return (
    <div className={classes['sign-up-container']}>
      <AnimatePresence>
        {step === 'role' && <RoleFormItem />}
        {step === 'account' && <CreateAccountItem />}
        {step === 'confirm' && <ConfirmBoxItem />}{' '}
      </AnimatePresence>
    </div>
  );
}
