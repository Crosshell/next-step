'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';

import classes from './SignUpItems.module.css';

interface Props {
  isVisible: boolean;
}

export default function RoleFormItem({ isVisible }: Props) {
  const router = useRouter();

  const stepUpHandler = (role: string) => {
    router.push('/sign-up?step=account');
  };

  return (
    <div className={isVisible ? '' : classes.hidden}>
      <motion.div
        className={classes['sign-up-form']}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4 }}
      >
        <h3>Step 1: Registration</h3>
        <h5>Choose your role</h5>
        <div className={classes['role-form']}>
          <HoveredItem>
            <label className={classes['role-btn']}>
              <input
                type="radio"
                name="role"
                value="JOB_SEEKER"
                onChange={() => stepUpHandler('JOB_SEEKER')}
              />
              <span> Job Seeker</span>
            </label>
          </HoveredItem>
          <HoveredItem>
            <label className={classes['role-btn']}>
              <input
                type="radio"
                name="role"
                value="COMPANY"
                onChange={() => stepUpHandler('COMPANY')}
              />
              <span>Company</span>
            </label>
          </HoveredItem>
        </div>
        <div className="row-center">
          <HoveredItem scale={1.05}>
            <Link href="/sign-in" className={classes['link']}>
              I already have an account
            </Link>
          </HoveredItem>
        </div>
      </motion.div>
    </div>
  );
}
