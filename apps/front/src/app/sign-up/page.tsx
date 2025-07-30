'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import RegistrationForm from '@/components/SignUpItems/RegistrationForm';

import classes from './page.module.css';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sign-up?step=role');
  }, [router]);

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
      <RegistrationForm />
    </>
  );
}
