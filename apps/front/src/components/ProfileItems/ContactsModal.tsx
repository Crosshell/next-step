'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';

import LabeledField from './LabeledField';
import RequestErrors from '../RequestErrors/RequestErrors';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

import { ContactsData } from '@/types/profile';
import { useModalStore } from '@/store/modalSlice';
import { contactsFallbackValues } from '@/lib/profile-data';
import {
  removeEmpty,
  replaceNulls,
  validateContacts,
} from '@/utils/profileValidation';
import { updateUserContacts } from '@/services/jobseekerService';
import { useState } from 'react';

interface Props {
  data: ContactsData | null;
}

export default function ContactsModal({ data }: Props) {
  const closeModal = useModalStore((state) => state.closeModal);
  const [requestError, setRequestError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    mutate: updateContacts,
    isPending,
    isError,
  } = useMutation({
    mutationFn: updateUserContacts,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

      closeModal();
    },
  });

  console.log(isError);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
    >
      <Formik
        initialValues={(data && replaceNulls(data)) || contactsFallbackValues}
        validate={validateContacts}
        onSubmit={(values) => {
          console.log(removeEmpty(values));
          updateContacts(removeEmpty(values));
        }}
      >
        {() => (
          <Form className={classes['contacts-form']}>
            <h2>Add your contact information</h2>
            <LabeledField name="githubUrl" label="Github URL" />
            <LabeledField name="linkedinUrl" label="LinkedIn URL" />
            <LabeledField name="telegramUrl" label="Telegram URL" />
            <LabeledField
              name="publicEmail"
              label="Public Email"
              type="email"
            />
            <LabeledField name="phoneNumber" label="Phone Number" />
            {requestError && <RequestErrors error={requestError} />}

            <div
              className={`row-space-between ${classes['contacts-btn-container']}`}
            >
              <button
                className={classes['contacts-form-btn-link']}
                type="button"
                onClick={closeModal}
              >
                <AnimatedIcon>Go Back</AnimatedIcon>
              </button>
              <button
                className={classes['contacts-form-btn']}
                type="submit"
                disabled={isPending}
              >
                <AnimatedIcon>Save changes</AnimatedIcon>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
