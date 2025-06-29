'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import HoveredItem from '../HoveredItem/HoveredItem';
import ErrorItem from '../ErrorItem/ErrorItem';

import classes from './SignUpItems.module.css';

import { ProfileFormData, ValidationError } from '@/types/authForm';
import { validateProfileForm } from '@/utils/validation';

export default function ProfileForm() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const profileData = Object.fromEntries(
      formData.entries()
    ) as unknown as ProfileFormData;

    const validationErrors = validateProfileForm(profileData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors([...validationErrors]);
      return;
    } else {
      setErrors([]);
    }

    console.log(JSON.stringify(profileData, null, 2));
  };

  return (
    <div className={classes['profile-form-container']}>
      <motion.form
        className={classes['sign-up-form']}
        ref={formRef}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4 }}
      >
        <h3>Step 3: Your Professional Profile</h3>
        <h5>Tell us about yourself</h5>

        <div className={classes['personal-info']}>
          <label htmlFor="first-name">1. First Name</label>
          <input
            className={classes['form-input']}
            id="first-name"
            name="first-name"
            type="text"
            placeholder="Bob"
          />
          <label htmlFor="last-name">2. Last Name</label>
          <input
            className={classes['form-input']}
            id="last-name"
            name="last-name"
            type="text"
            placeholder="Coolman"
          />
          <label htmlFor="birth-date">3. Date of Birth</label>
          <input
            className={classes['form-input']}
            id="birth-date"
            name="birth-date"
            type="date"
          />
          <label htmlFor="field">4. Field of Work</label>
          <input
            className={classes['form-input']}
            id="field"
            name="field"
            type="text"
            placeholder="Choose your role"
          />
          <label htmlFor="level">5. Seniority Level</label>
          <input
            className={classes['form-input']}
            id="level"
            name="level"
            type="text"
            placeholder="Choose your level"
          />
          <label htmlFor="education">6. Education</label>
          <input
            className={classes['form-input']}
            id="education"
            name="university"
            type="text"
            placeholder="Write your university name"
          />
          <input
            className={classes['form-input']}
            name="specialty"
            type="text"
            placeholder="Write your specialty"
          />
        </div>

        {errors.length > 0 && (
          <div className={classes['error-container']}>
            {errors.map((error) => {
              return <ErrorItem key={error.message} message={error.message} />;
            })}
          </div>
        )}

        <h5>
          You can change this information anytime in your{' '}
          <span className="font-weight-600">Profile Page</span>
        </h5>
        <div className="row-center">
          <HoveredItem>
            <button className={classes['continue-btn']} type="submit">
              Finish registration
            </button>
          </HoveredItem>
        </div>
      </motion.form>
    </div>
  );
}
