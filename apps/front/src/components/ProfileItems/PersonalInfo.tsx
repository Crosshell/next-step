'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { PersonalData } from '@/types/profile';
import { isoToDate, isoToSimpleDate } from '@/utils/convertData';
import { validateProfileForm } from '@/utils/profileValidation';
import MessageBox from '../MessageBox/MessageBox';

export default function PersonalInfo({
  firstName,
  lastName,
  dateOfBirth,
  location,
}: PersonalData) {
  const [isChanging, setIsChanging] = useState(false);

  const data = {
    firstName,
    lastName,
    dateOfBirth: dateOfBirth ? isoToSimpleDate(dateOfBirth) : '',
    location: location ? location : '',
  };
  const [formData, setFormData] = useState<PersonalData>(data);

  const handleCancel = () => {
    setIsChanging(false);
  };

  const handleSubmit = (values: PersonalData) => {
    console.log('Updated:', values);
    setFormData(values);
    setIsChanging(false);
  };

  return (
    <>
      {!isChanging ? (
        <>
          <div className={classes['personal-info']}>
            <h2>
              {formData.firstName} {formData.lastName}
            </h2>
            <p>
              {formData.dateOfBirth
                ? isoToDate(formData.dateOfBirth)
                : 'No birthdate information'}
            </p>
            <p>
              {formData.location ? formData.location : 'No address information'}
            </p>
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
          initialValues={formData}
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
                  name="address"
                  type="text"
                  placeholder="Address"
                />
              </div>

              {Object.keys(errors).length > 0 && (
                <div className={classes['error-container']}>
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
                <button className={classes['personal-info-btn']} type="submit">
                  <AnimatedIcon iconType={faCheck} />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
