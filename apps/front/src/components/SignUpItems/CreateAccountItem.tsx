'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';
import ErrorItem from '../ErrorItem/ErrorItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classes from './SignUpItems.module.css';

interface Props {
  errors: string[];
}

export default function CreateAccountItem({ errors }: Props) {
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const stepBackHandler = () => {
    router.push('/sign-up?step=role');
  };

  return (
    <motion.div
      className={classes['sign-up-form']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 1: Registration</h3>
      <h5>Create an account to start your journey</h5>

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
          placeholder="Create a cool password"
        />
        <input
          className={classes['form-input']}
          ref={confirmRef}
          type="password"
          name="confirm"
          placeholder="Repeat your cool password"
        />
      </div>

      {errors.length > 0 && (
        <div className={classes['error-container']}>
          {errors.map((error) => {
            return <ErrorItem key={error} message={error} />;
          })}
        </div>
      )}

      <div className="row-space-between">
        <div className="align-center">
          <HoveredItem scale={1.1}>
            <button
              className={classes['go-back-btn']}
              onClick={() => stepBackHandler()}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Go back
            </button>
          </HoveredItem>
        </div>
        <HoveredItem scale={1.05}>
          <button type="submit" className={classes['continue-btn']}>
            Create account
          </button>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
