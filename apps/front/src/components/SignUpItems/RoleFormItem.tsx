import Link from 'next/link';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';

import classes from './SignUpItems.module.css';

import { PartialRegistrationFormData } from '@/types/authForm';

interface Props {
  onRoleSelect: (newFormData: PartialRegistrationFormData) => void;
}

export default function RoleFormItem({ onRoleSelect }: Props) {
  return (
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
          <button
            className={classes['role-btn']}
            onClick={() =>
              onRoleSelect({
                role: 'job-seeker',
              })
            }
          >
            Job Seeker
          </button>
        </HoveredItem>
        <HoveredItem>
          <button
            className={classes['role-btn']}
            onClick={() =>
              onRoleSelect({
                role: 'company',
              })
            }
          >
            Company
          </button>
        </HoveredItem>
      </div>
      <div className="row-center">
        <HoveredItem scale={1.05}>
          <Link href="/log-in" className={classes['link']}>
            I already have an account
          </Link>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
