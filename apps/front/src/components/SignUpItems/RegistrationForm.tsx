'use client';
import { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { AnimatePresence } from 'framer-motion';

import RoleFormItem from './RoleFormItem';
import CreateAccountItem from './CreateAccountItem';
import ConfirmBoxItem from './ConfirmBoxItem';

import classes from './SignUpItems.module.css';

import { RegistrationFormData, ValidationError } from '@/types/authForm';
import { validateRegistrationForm } from '@/utils/validation';

export default function RegistrationForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const searchParams = useSearchParams();
  const step = searchParams.get('step');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const registrationData = Object.fromEntries(
      formData.entries()
    ) as unknown as RegistrationFormData;

    const validationErrors = validateRegistrationForm(registrationData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors([...validationErrors]);
      return;
    } else {
      setErrors([]);
      router.push('/sign-up?step=confirm');
    }

    console.log(JSON.stringify(registrationData, null, 2));
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
        {step === 'confirm' && <ConfirmBoxItem />}{' '}
      </AnimatePresence>
    </div>
  );
}
