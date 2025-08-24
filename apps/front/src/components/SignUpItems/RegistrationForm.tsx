'use client';
import { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { AnimatePresence } from 'framer-motion';

import RoleFormItem from './RoleFormItem';
import CreateAccountItem from './CreateAccountItem';
import ConfirmBoxItem from './ConfirmBoxItem';

import classes from './SignUpItems.module.css';

import { RegistrationFormData } from '@/types/authForm';
import { validateRegistrationForm } from '@/utils/validation';
import { registerUser } from '@/services/userService';

export default function RegistrationForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const step = searchParams.get('step');

  const { mutate } = useMutation({
    mutationFn: registerUser,
    onSuccess: (result) => {
      if (result.status === 'error') {
        setErrors([result.error]);
        console.log('Error:', result.error);
        return;
      }
      router.push('/sign-up?step=confirm');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const registrationData = Object.fromEntries(
      formData.entries()
    ) as unknown as RegistrationFormData;

    const validationErrors = validateRegistrationForm(registrationData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors([]);
      setEmail(registrationData.email);
      mutate({
        email: registrationData.email,
        password: registrationData.password,
        type: registrationData.role,
      });
    }
  };

  return (
    <div className={classes['sign-up-container']}>
      <AnimatePresence>
        {(step === 'role' || step === 'account') && (
          <form ref={formRef} onSubmit={handleSubmit}>
            <RoleFormItem isVisible={step === 'role'} />
            {step === 'account' && <CreateAccountItem errors={errors} />}
          </form>
        )}
        {step === 'confirm' && <ConfirmBoxItem email={email ?? ''} />}
      </AnimatePresence>
    </div>
  );
}
