'use client';

import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import { faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import classes from './Profile.module.css';
import { PersonalData } from '@/types/profile';

export default function PersonalInfo({
  name,
  birthdate,
  address,
}: PersonalData) {
  const [isChanging, setIsChanging] = useState(false);
  const [formData, setFormData] = useState<PersonalData>({
    name,
    birthdate,
    address,
  });

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
            <h2>{formData.name}</h2>
            <p>{formData.birthdate}</p>
            <p>{formData.address}</p>
          </div>
          <button
            className={classes['edit-personal-info-btn']}
            onClick={() => setIsChanging(true)}
          >
            <AnimatedIcon iconType={faPencil} />
          </button>
        </>
      ) : (
        <Formik initialValues={formData} onSubmit={handleSubmit}>
          {() => (
            <Form className={classes['info-form']}>
              <div className={classes['personal-info']}>
                <Field
                  className={classes['name-input']}
                  name="name"
                  type="text"
                />
                <Field name="birthdate" type="date" />
                <Field name="address" type="text" />
              </div>
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
