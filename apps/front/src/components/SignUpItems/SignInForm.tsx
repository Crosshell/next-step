'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import classes from './SignUpItems.module.css';

import HoveredItem from '../HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import { RegistrationFormData } from '@/types/authForm';
import { validateEmail, validateLogInForm } from '@/utils/validation';
import { forgetPass, loginUser } from '@/services/userService';

import { useAuthStore } from '@/store/authSlice';

export default function SignInForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [forgetPassIsClicked, setForgetPassIsClicked] =
    useState<boolean>(false);

  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const setIsLogged = useAuthStore((state) => state.setIsLogged);

  const { mutate: loginMutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      if (result.status === 'error') {
        setErrors([result.error]);
        console.log('Error:', result.error);
        return;
      }
      setIsLogged(true);
      router.push('/profile');
    },
  });

  const { mutate: forgotPassMutate } = useMutation({
    mutationFn: forgetPass,
    onSuccess: (result) => {
      if (result.status === 'error') {
        setErrors([result.error]);
        console.log('Error:', result.error);
        return;
      }
      setErrors([]);
      setForgetPassIsClicked(true);
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
      loginMutate({
        email: registrationData.email,
        password: registrationData.password,
      });
    }

    console.log(JSON.stringify(registrationData, null, 2));
  };

  const handleForgotPassword = () => {
    const emailValue = emailRef.current?.value;
    if (emailValue) {
      if (validateEmail(emailRef.current?.value)) {
        setErrors(['Enter correct email to reset password']);
        return;
      }
      forgotPassMutate({ email: emailValue });
    }
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
              return <MessageBox key={error}>{error}</MessageBox>;
            })}
          </div>
        )}

        {forgetPassIsClicked && (
          <MessageBox type="info">
            Check your email to reset the password
          </MessageBox>
        )}

        <div className="row-space-between">
          <div className="align-center">
            <button
              type="button"
              className={classes['link']}
              onClick={handleForgotPassword}
            >
              I have forgot my password
            </button>
          </div>
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
