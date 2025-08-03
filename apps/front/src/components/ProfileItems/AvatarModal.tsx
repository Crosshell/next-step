'use client';

import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import { updatePersonalData } from '@/services/jobseekerService';
import RequestError from '../RequestErrors/RequestErrors';
import { validateAvatarUrl } from '@/utils/profileValidation';

interface Props {
  url: string;
}

export default function AvatarModal({ url }: Props) {
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

  return (
    <Formik
      initialValues={{ avatarUrl: url ?? '' }}
      validate={validateAvatarUrl}
      onSubmit={(values) => {
        updateAvatar(values);
      }}
    >
      {({ errors, touched }) => (
        <Form className={classes['avatar-form']}>
          <div className={classes['avatar-form-container']}>
            <Field
              name="avatarUrl"
              type="text"
              placeholder="Enter avatar image URL"
              className={`${classes['form-input']} ${classes['form-details']}`}
            />

            <button
              type="submit"
              className={classes['info-form-btn']}
              disabled={isPending}
            >
              <AnimatedIcon scale={1.07}>
                {!isPending ? 'Save changes' : 'Saving...'}
              </AnimatedIcon>
            </button>
          </div>

          {errors.avatarUrl && touched.avatarUrl && (
            <div className={classes['validation-error']}>
              {errors.avatarUrl}
            </div>
          )}
          {requestError && <RequestError error={requestError} />}
        </Form>
      )}
    </Formik>
  );
}
