'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import RegistrationForm from '@/components/SignUpItems/RegistrationForm';

import classes from './page.module.css';
import ProfileForm from '@/components/SignUpItems/ProfileForm';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');

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
      {step !== 'profile' ? <RegistrationForm /> : <ProfileForm />}
    </>
  );
}
