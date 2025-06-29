'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

import classes from './SignUpItems.module.css';

import HoveredItem from '../HoveredItem/HoveredItem';
import ErrorItem from '../ErrorItem/ErrorItem';

import { RegistrationFormData } from '@/types/authForm';
import { validateLogInForm } from '@/utils/validation';
import { loginUser } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';

export default function SignInForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      if (result.error) {
        setErrors(result.error);
        console.log('Error:', result.error);
        return;
      }
      router.push('/profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const registrationData = Object.fromEntries(
      formData.entries()
    ) as unknown as RegistrationFormData;

    const validationErrors = validateLogInForm(registrationData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors([]);
      mutate({
        email: registrationData.email,
        password: registrationData.password,
      });
    }

    console.log(JSON.stringify(registrationData, null, 2));
  };

  return (
    <form
      ref={formRef}
      className={classes['sign-up-container']}
      onSubmit={handleSubmit}
    >
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
            ref={emailRef}
            type="email"
            name="email"
            placeholder="Enter your e-mail address"
          />
          <input
            className={classes['form-input']}
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="Enter your password"
          />
        </div>

        {errors.length > 0 && (
          <div className={classes['error-container']}>
            {errors.map((error) => {
              return <ErrorItem key={error} message={error} />;
            })}
          </div>
        )}

        <div className="row-center">
          <div className="align-center"></div>
          <HoveredItem scale={1.05}>
            <button
              type="submit"
              className={`${classes['continue-btn']} ${classes['sign-in-btn']}`}
            >
              Sign In
            </button>
          </HoveredItem>
        </div>
      </motion.div>
    </form>
  );
}
