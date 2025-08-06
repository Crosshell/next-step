'use client';

import { motion } from 'framer-motion';

import JobSeekerProfileForm from './JobSeekerProfileForm';

import classes from './Profile.module.css';
import CompanyProfileForm from '../CompanyProfileItems/CompanyProfileForm';

interface Props {
  role: 'job-seeker' | 'company';
}

export default function ProfileForm({ role }: Props) {
  return (
    <motion.div
      className={classes['profile-form-container']}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {role === 'job-seeker' ? (
        <JobSeekerProfileForm />
      ) : (
        <CompanyProfileForm />
      )}
    </motion.div>
  );
}
