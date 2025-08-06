'use client';

import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import { updatePersonalData } from '@/services/jobseekerService';
import RequestError from '../RequestErrors/RequestErrors';
import { validateAvatarUrl } from '@/utils/profileValidation';
import { updateCompanyProfile } from '@/services/companyProfileService';

interface Props {
  url: string;
  type?: 'job-seeker' | 'company';
}

export default function AvatarModal({ url, type }: Props) {
  const [requestError, setRequestError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateAvatar, isPending } = useMutation({
    mutationFn: updatePersonalData,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const { mutate: updateCompanyAvatar, isPending: isCompanyPending } =
    useMutation({
      mutationFn: updateCompanyProfile,
      onSuccess: async (result) => {
        if (result.status === 'error') {
          setRequestError(result.error);
          return;
        }
        setRequestError(null);
        await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      },
    });

  return (
    <Formik
      initialValues={{ url: url ?? '' }}
      validate={validateAvatarUrl}
      onSubmit={(values) => {
        if (type === 'job-seeker') updateAvatar({ avatarUrl: values.url });
        else updateCompanyAvatar({ logoUrl: values.url });
      }}
    >
      {({ errors, touched }) => (
        <Form className={classes['avatar-form']}>
          <div className={classes['avatar-form-container']}>
            <Field
              name="url"
              type="text"
              placeholder="Enter avatar image URL"
              className={`${classes['form-input']} ${classes['form-details']}`}
            />

            <button
              type="submit"
              className={classes['info-form-btn']}
              disabled={isPending || isCompanyPending}
            >
              <AnimatedIcon scale={1.07}>
                {!isPending || !isCompanyPending ? 'Save changes' : 'Saving...'}
              </AnimatedIcon>
            </button>
          </div>

          {errors.url && touched.url && (
            <div className={classes['validation-error']}>{errors.url}</div>
          )}
          {requestError && <RequestError error={requestError} />}
        </Form>
      )}
    </Formik>
  );
}
