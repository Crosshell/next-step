'use client';
import { AnimatePresence } from 'framer-motion';

import ResetPasswordForm from '@/components/SignUpItems/ResetPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <>
      <AnimatePresence>
        <ResetPasswordForm />
      </AnimatePresence>
    </>
  );
}
