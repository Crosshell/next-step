'use client';

import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';

import AnimatedIcon from '../HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from './Profile.module.css';

import { ProfileFormData } from '@/types/authForm';
import { validateProfileForm } from '@/utils/profileValidation';

const initialValues: ProfileFormData = {
  firstName: '',
  lastName: '',
  birthDate: '',
};

export default function ProfileForm() {
  const handleSubmit = (values: ProfileFormData) => {
    console.log(values);
  };

  return (
    <motion.div
      className={classes['profile-form-container']}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={initialValues}
        validate={validateProfileForm}
        onSubmit={handleSubmit}
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
                  id="birthDate"
                  name="birthDate"
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

            <h5>
              You can change this information anytime in your{' '}
              <span className="font-weight-600">Profile Page</span>
            </h5>
            <div className="row-center">
              <button className={classes['profile-form-btn']} type="submit">
                <AnimatedIcon>Create Profile </AnimatedIcon>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
