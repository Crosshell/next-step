import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '../HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from '../ProfileItems/Profile.module.css';

import { MainInfoData } from '@/types/companyProfile';
import { useModalStore } from '@/store/modalSlice';
import {
  removeEmpty,
  validateCompanyInfoData,
} from '@/utils/companyProfileValidation';
import { createCompanyProfile } from '@/services/companyProfileService';

const initialValues: MainInfoData = {
  name: '',
  url: '',
};

export default function CompanyProfileForm() {
  const [requestErrors, setRequestErrors] = useState<string[]>([]);
  const router = useRouter();
  const closeModal = useModalStore((state) => state.closeModal);

  const queryClient = useQueryClient();

  const { mutate: createProfile, isPending } = useMutation({
    mutationFn: createCompanyProfile,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestErrors([result.error]);
        return;
      }

      setRequestErrors([]);
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      closeModal();
      router.refresh();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validate={validateCompanyInfoData}
      onSubmit={(values) => {
        createProfile(removeEmpty(values));
      }}
    >
      {({ errors }) => (
        <Form>
          <h1>Create Your Professional Profile</h1>
          <h2>Tell us about yourself</h2>

          <div className={classes['profile-form']}>
            <div>
              <p>1. Company Name</p>
              <Field
                className={classes['form-input']}
                name="name"
                placeholder="Cool Company"
                type="text"
              />
            </div>

            <div>
              <p>2. Website Url</p>
              <Field
                className={classes['form-input']}
                name="url"
                placeholder="https://cool-company.url"
                type="text"
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
              <Link href="/my-profile" className={classes['link']}>
                I am not a Company
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
