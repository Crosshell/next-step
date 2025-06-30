'use client';
import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import classes from './SignUpItems.module.css';

import HoveredItem from '../HoveredItem/HoveredItem';
import MessageBox from '../ErrorItem/ErrorItem';

import { checkPasswords } from '@/utils/validation';
import { resetPass } from '@/services/userService';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: resetPass,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = checkPasswords(
      passwordRef.current?.value,
      confirmPassRef.current?.value
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors([]);
      mutate({
        token: token,
        password: passwordRef.current?.value,
      });
    }
  };

  return (
    <form className={classes['sign-up-container']} onSubmit={handleSubmit}>
      <motion.div
        className={classes['sign-up-form']}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4 }}
      >
        <h3>Welcome back!</h3>
        <h5>Enter your email and password to continue</h5>

        <div>
          <input
            className={classes['form-input']}
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="Enter your password"
          />
          <input
            className={classes['form-input']}
            ref={confirmPassRef}
            type="password"
            name="confirmPass"
            placeholder="Repeat your password"
          />
        </div>

        {errors.length > 0 && (
          <div className={classes['error-container']}>
            {errors.map((error) => {
              return <MessageBox key={error}>{error}</MessageBox>;
            })}
          </div>
        )}

        <div className={classes['info-container']}>
          {isSuccess && (
            <>
              <MessageBox type="info">
                <p>
                  Successfully changed your password! You can{' '}
                  <Link
                    href="sign-in"
                    className="underline-link font-weight-600"
                  >
                    sign up
                  </Link>{' '}
                  now
                </p>
              </MessageBox>
            </>
          )}
          {isError && <MessageBox>Failed to change your password</MessageBox>}

          {isPending && (
            <MessageBox type="info">
              Wait while we changing your password...
            </MessageBox>
          )}
        </div>

        <div className="row-center">
          <HoveredItem scale={1.05}>
            <button
              type="submit"
              className={`${classes['continue-btn']} ${classes['forgot-pass-btn']}`}
            >
              Save password
            </button>
          </HoveredItem>
        </div>
      </motion.div>
    </form>
  );
}
