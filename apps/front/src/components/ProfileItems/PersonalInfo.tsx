'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import MessageBox from '../MessageBox/MessageBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { PersonalData, UpdatedPersonalData } from '@/types/profile';
import { isoToDate, isoToSimpleDate } from '@/utils/convertData';
import { validateProfileForm } from '@/utils/profileValidation';
import { updatePersonalData } from '@/services/jobseekerService';

export default function PersonalInfo({
  firstName,
  lastName,
  dateOfBirth,
  location,
}: PersonalData) {
  const [isChanging, setIsChanging] = useState(false);
  const [requestErrors, setRequestErrors] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { mutate: updateInfo, isPending } = useMutation({
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

  const handleCancel = () => {
    setIsChanging(false);
  };

  const handleSubmit = async (values: UpdatedPersonalData) => {
    updateInfo(values);
  };

  const initialValues: UpdatedPersonalData = {
    firstName,
    lastName,
    dateOfBirth: dateOfBirth ? isoToSimpleDate(dateOfBirth) : '',
    location: location || '',
  };

  return (
    <>
      {!isChanging ? (
        <>
          <div className={classes['personal-info']}>
            <h2>
              {firstName} {lastName}
            </h2>
            <p>
              {dateOfBirth
                ? isoToDate(dateOfBirth)
                : 'No birthdate information'}
            </p>
            <p>{location || 'No address information'}</p>
          </div>
          <button
            className={classes['edit-personal-info-btn']}
            onClick={() => setIsChanging(true)}
          >
            <AnimatedIcon iconType={faPencil} />
          </button>
        </>
      ) : (
        <Formik
          initialValues={initialValues}
          validate={validateProfileForm}
          onSubmit={handleSubmit}
        >
          {({ errors }) => (
            <Form className={classes['info-form']}>
              <div className={classes['personal-info']}>
                <Field
                  className={classes['name-input']}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
                <Field
                  className={classes['name-input']}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
                <Field
                  className={classes['birthdate-input']}
                  name="dateOfBirth"
                  type="date"
                />
                <Field
                  className={classes['address-input']}
                  name="location"
                  type="text"
                  placeholder="Address"
                />
              </div>

              {Object.keys(errors).length > 0 && (
                <div className={classes['personal-info-error-container']}>
                  {Object.values(errors).map((err) => (
                    <MessageBox key={err}>{err}</MessageBox>
                  ))}
                </div>
              )}

              <div className={classes['personal-info-btn-container']}>
                <button
                  className={classes['personal-info-btn-cross']}
                  type="button"
                  onClick={handleCancel}
                >
                  <AnimatedIcon iconType={faXmark} />
                </button>
                <button
                  className={classes['personal-info-btn']}
                  type="submit"
                  disabled={isPending}
                >
                  <AnimatedIcon iconType={faCheck} />
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
    </>
  );
}
