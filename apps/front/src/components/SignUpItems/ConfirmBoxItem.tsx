'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import classes from './SignUpItems.module.css';

import HoveredItem from '../HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import { resendEmail } from '@/services/userService';

interface Props {
  email: string;
}

export default function ConfirmBoxItem({ email }: Props) {
  const router = useRouter();

  const { mutate, isSuccess, isPending, isError } = useMutation({
    mutationFn: resendEmail,
  });

  const stepUpHandler = () => {
    router.push('/sign-up?step=profile');
  };

  const onConfirmed = () => {
    stepUpHandler();
  };

  const handleResendEmail = () => {
    mutate({ email });
  };

  return (
    <motion.div
      className={classes['sign-up-form']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 2: Confirmation</h3>
      <div className={classes['image-container']}>
        <Image
          src="/images/letter.png"
          alt="stairs-image"
          width={300}
          height={200}
          priority
        />
      </div>
      <h5>
        Please check your inbox and click the confirmation link to verify your
        email address.
      </h5>

      <div className={classes['info-container']}>
        {isSuccess && (
          <>
            <MessageBox type="info">
              <p>We have sent you another confirmation letter</p>
            </MessageBox>
          </>
        )}
        {isError && (
          <MessageBox>Failed to resent a confirmation letter</MessageBox>
        )}

        {isPending && (
          <MessageBox type="info">
            Wait while we sending you another letter...
          </MessageBox>
        )}
      </div>

      <div className="row-space-between">
        <div className="align-center">
          <HoveredItem scale={1.1}>
            <button
              className={classes['go-back-btn']}
              onClick={handleResendEmail}
            >
              Resend Email
            </button>
          </HoveredItem>
        </div>
        <HoveredItem scale={1.05}>
          <button className={classes['continue-btn']} onClick={onConfirmed}>
            Confirmed
          </button>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
