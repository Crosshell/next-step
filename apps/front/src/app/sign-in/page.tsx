'use client';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';

import classes from './page.module.css';
import SignInForm from '@/components/SignUpItems/SignInForm';

export default function SignUpPage() {
  return (
    <>
      <div className={classes['background']}>
        <Image
          src="/images/arrow.png"
          alt="background-arrow"
          width={1920}
          height={1080}
          priority
        />
      </div>
      <AnimatePresence>
        <SignInForm />
      </AnimatePresence>
    </>
  );
}
