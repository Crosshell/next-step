'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import classes from './page.module.css';

import { checkUserConfirmed } from '@/services/userService';
import { useAuthStore } from '@/store/authSlice';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const setIsConfirmed = useAuthStore((state) => state.setIsConfirmed);

  const { isSuccess, isLoading, isError } = useQuery({
    queryKey: ['checkUserConfirmed', token],
    queryFn: ({ queryKey }) => checkUserConfirmed(queryKey[1]),
    enabled: !!token,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsConfirmed(true);
    }
  }, [isSuccess, setIsConfirmed]);

  let message;
  let imageUrl = '/images/';
  if (isSuccess) {
    imageUrl += 'check-arrow.png';
    message = 'Your email was successfully verified!';
  }

  if (isLoading) {
    imageUrl += 'loading-spin.gif';

    message = 'Wait while we verifying your email...';
  }

  if (isError) {
    imageUrl += 'black-on-white-cross.png';
    message = 'Sorry! We were unable to verify your account';
  }

  return (
    <div className={classes['check-box-container']}>
      <motion.div
        className={classes['check-box']}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4 }}
      >
        <div className={classes['image-container']}>
          <Image
            src={imageUrl}
            alt="stairs-image"
            width={300}
            height={200}
            priority
          />
        </div>

        <h2>{message}</h2>
        {isSuccess && (
          <h3>
            You can now <Link href="/sign-in">sign in</Link> to your account
          </h3>
        )}
      </motion.div>
    </div>
  );
}
