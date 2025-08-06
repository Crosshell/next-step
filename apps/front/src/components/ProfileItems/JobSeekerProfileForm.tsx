import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '../HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from './Profile.module.css';

import { ProfileFormData } from '@/types/profile';
import { useModalStore } from '@/store/modalSlice';
import { createProfile as createProfileFn } from '@/services/jobseekerService';
import { validateProfileForm } from '@/utils/profileValidation';

const initialValues: ProfileFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
};

export default function JobSeekerProfileForm() {
  const [requestErrors, setRequestErrors] = useState<string[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const closeModal = useModalStore((state) => state.closeModal);
  const { mutate: createProfile, isPending } = useMutation({
    mutationFn: createProfileFn,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestErrors([result.error]);
        return;
      }

      setRequestErrors([]);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      closeModal();
      router.refresh();
    },
  });
  return (
    <Formik
      initialValues={initialValues}
      validate={validateProfileForm}
      onSubmit={(values) => {
        createProfile(values);
      }}
    >
      {({ errors }) => (
        <Form>
          <h1>Create Your Professional Profile</h1>
          <h2>Tell us about yourself</h2>

          <div className={classes['profile-form']}>
            <div>
              <p>1. First Name</p>
              <Field
                className={classes['form-input']}
                name="firstName"
                placeholder="Bob"
                type="text"
              />
            </div>

            <div>
              <p>2. Last Name</p>
              <Field
                className={classes['form-input']}
                name="lastName"
                placeholder="Coolman"
                type="text"
              />
            </div>
            <div>
              <p>3. Date of Birth</p>
              <Field
                className={classes['form-input']}
                name="dateOfBirth"
                type="date"
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className={classes['error-container']}>
              {Object.values(errors).map((err) => (
                <MessageBox key={err}>{err}</MessageBox>
              ))}
            </div>
          )}

          {requestErrors.length > 0 && (
            <div className={classes['error-container']}>
              {requestErrors.map((error) => {
                return <MessageBox key={error}>{error}</MessageBox>;
              })}
            </div>
          )}

          <h5>
            You can change this information anytime in your{' '}
            <span className="font-weight-600">Profile Page</span>
          </h5>
          <div className="row-space-between">
            <div className="align-center">
              <Link href="/my-company" className={classes['link']}>
                I am not a Job Seeker
              </Link>
            </div>

            <button
              className={classes['profile-form-btn']}
              type="submit"
              disabled={isPending}
            >
              <AnimatedIcon>
                {isPending ? 'Creating...' : 'Create Profile'}
              </AnimatedIcon>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
