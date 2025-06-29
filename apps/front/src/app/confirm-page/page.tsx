'use client';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { checkUserConfirmed } from '@/services/userService';

import { motion } from 'framer-motion';
import classes from './page.module.css';

export default function ConfirmPage() {
  const { isSuccess, isLoading, isError } = useQuery({
    queryKey: ['checkUserConfirmed'],
    queryFn: checkUserConfirmed,
  });

  let message;
  if (isSuccess)
    message =
      'Your email was successfully verified! You can continue to your account';

  if (isLoading) message = 'Wait while we verifying your email...';

  if (isError) message = 'Sorry! We were unable to verify your account';

  return (
    <motion.div
      className={classes['check-box']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <div className={classes['image-container']}>
        <Image
          src="/images/check-arrow.png"
          alt="stairs-image"
          width={300}
          height={200}
          priority
        />
      </div>

      <h2>{message}</h2>
    </motion.div>
  );
}
