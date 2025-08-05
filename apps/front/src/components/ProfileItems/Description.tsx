'use client';

import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import InfoBox from './InfoBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from './Profile.module.css';

import { updatePersonalData } from '@/services/jobseekerService';

interface Props {
  data: string | null;
  isEditable?: boolean;
  title?: string;
}

export default function Bio({ isEditable, data, title = 'Bio' }: Props) {
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [requestErrors, setRequestErrors] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { mutate: updateBio, isPending } = useMutation({
    mutationFn: updatePersonalData,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestErrors([result.error]);
        return;
      }
      setRequestErrors([]);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsChanging(false);
    },
  });

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
  };

  return (
    <InfoBox
      title={isEditable ? 'Your ' + title : title}
      isEditable={isEditable}
      onEdit={toggleEdit}
    >
      {!isChanging ? (
        <p>{!data || data.trim().length === 0 ? 'No data there yet' : data}</p>
      ) : (
        <Formik
          initialValues={{ bio: data ?? '' }}
          enableReinitialize
          onSubmit={(values) => {
            console.log(values);
            updateBio(values);
          }}
        >
          {() => (
            <Form className={classes['bio-form']}>
              <Field
                className={`${classes['form-input']} ${classes['form-details']}`}
                name="bio"
                as="textarea"
                placeholder="Tell us about yourself"
                rows={10}
              />

              <div className={classes['form-btn-container']}>
                <button
                  className="underline-link"
                  type="button"
                  onClick={() => setIsChanging(false)}
                >
                  <AnimatedIcon scale={1.07}>Go Back</AnimatedIcon>
                </button>
                <button
                  className={classes['info-form-btn']}
                  type="submit"
                  disabled={isPending}
                >
                  <AnimatedIcon scale={1.07}>
                    {!isPending ? 'Save changes' : 'Saving changes...'}
                  </AnimatedIcon>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {requestErrors.length > 0 && (
        <div className={classes['personal-info-error-container']}>
          {requestErrors.map((error) => (
            <MessageBox key={error}>{error}</MessageBox>
          ))}
        </div>
      )}
    </InfoBox>
  );
}
