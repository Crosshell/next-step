'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';

import classes from './SignUpItems.module.css';

import { PartialRegistrationFormData } from '@/types/authForm';
import { AppDispatch } from '@/store/store';
import { changeRegFormData } from '@/store/slices/signUpSlice';

export default function RoleFormItem() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const stepUpHandler = () => {
    router.push('/sign-up?step=account');
  };

  const changeFormData = (accountData: PartialRegistrationFormData) => {
    dispatch(changeRegFormData(accountData));
  };

  const handleChangeFormData = (accountData: PartialRegistrationFormData) => {
    changeFormData(accountData);
    stepUpHandler();
  };

  return (
    <motion.div
      className={classes['sign-up-form']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 1: Registration</h3>
      <h5>Choose your role</h5>
      <div className={classes['role-form']}>
        <HoveredItem>
          <button
            className={classes['role-btn']}
            onClick={() =>
              handleChangeFormData({
                role: 'job-seeker',
              })
            }
          >
            Job Seeker
          </button>
        </HoveredItem>
        <HoveredItem>
          <button
            className={classes['role-btn']}
            onClick={() =>
              handleChangeFormData({
                role: 'company',
              })
            }
          >
            Company
          </button>
        </HoveredItem>
      </div>
      <div className="row-center">
        <HoveredItem scale={1.05}>
          <Link href="/log-in" className={classes['link']}>
            I already have an account
          </Link>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
