'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classes from './SignUpItems.module.css';

import { PartialRegistrationFormData, ValidationError } from '@/types/authForm';
import { changeRegFormData } from '@/store/slices/signUpSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { validateRegistrationForm } from '@/utils/validation';
import ErrorItem from '../ErrorItem/ErrorItem';

export default function CreateAccountItem() {
  const router = useRouter();
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const stepUpHandler = () => {
    router.push('/sign-up?step=confirm');
  };

  const stepBackHandler = () => {
    router.push('/sign-up?step=role');
  };

  const changeFormData = (accountData: PartialRegistrationFormData) => {
    dispatch(changeRegFormData(accountData));
  };

  const handleChangeFormData = (accountData: PartialRegistrationFormData) => {
    const validationErrors = validateRegistrationForm(accountData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors([...validationErrors]);
      return;
    } else {
      setErrors([]);
      changeFormData(accountData);
      stepUpHandler();
    }
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
      <h5>Create an account to start your journey</h5>

      <div>
        <input
          className={classes['form-input']}
          ref={emailRef}
          type="email"
          placeholder="Enter your e-mail address"
        />
        <input
          className={classes['form-input']}
          ref={passwordRef}
          type="password"
          placeholder="Create a cool password"
        />
        <input
          className={classes['form-input']}
          ref={confirmRef}
          type="password"
          placeholder="Repeat your cool password"
        />
      </div>

      {errors.length > 0 && (
        <div className={classes['error-container']}>
          {errors.map((error, index) => {
            return <ErrorItem key={index} message={error.message} />;
          })}
        </div>
      )}

      <div className="row-space-between">
        <div className="align-center">
          <HoveredItem scale={1.1}>
            <button
              className={classes['go-back-btn']}
              onClick={() => stepBackHandler()}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Go back
            </button>
          </HoveredItem>
        </div>
        <HoveredItem scale={1.05}>
          <button
            className={classes['continue-btn']}
            onClick={() =>
              handleChangeFormData({
                email: emailRef.current?.value,
                password: passwordRef.current?.value,
                confirm: confirmRef.current?.value,
              })
            }
          >
            Create account
          </button>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
