import { useState } from 'react';
import { Field, Form, Formik } from 'formik';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

import { ContactsData } from '@/types/profile';
import { useModalStore } from '@/store/modalSlice';

interface Props {
  data: ContactsData;
}

export default function ContactsModal({ data }: Props) {
  const [formData, setFormData] = useState<ContactsData>(data);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleSubmit = (values: ContactsData) => {
    console.log('Updated:', values);
    setFormData(values);
    closeModal();
  };

  return (
    <Formik initialValues={formData} onSubmit={handleSubmit}>
      {() => (
        <Form className={classes['contacts-form']}>
          <h2>Add your contact information</h2>

          <p>linkedin URL</p>
          <Field name="linkedinURL" type="text" />
          <p>Github URL</p>
          <Field name="githubURL" type="text" />
          <p>Codewars URL</p>
          <Field name="codewarsURL" type="text" />
          <p>Telegram URL</p>
          <Field name="telegramURL" type="text" />
          <p>Facebook URL</p>
          <Field name="facebookURL" type="text" />
          <p></p>
          <div className="row-space-between">
            <button
              className={classes['contacts-form-btn']}
              type="button"
              onClick={closeModal}
            >
              <AnimatedIcon>Go Back</AnimatedIcon>
            </button>
            <button className={classes['contacts-form-btn']} type="submit">
              <AnimatedIcon>Save changes</AnimatedIcon>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
