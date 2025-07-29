'use client';

import { useState } from 'react';
import { Field, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

interface Props {
  data: string;
  isEditable?: boolean;
}

export default function Bio({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [bioData, setBioData] = useState<string>(data);

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
  };

  return (
    <InfoBox title="Your info" isEditable={isEditable} onEdit={toggleEdit}>
      {!isChanging ? (
        <p>{bioData.trim().length === 0 ? 'No bio there yet' : bioData}</p>
      ) : (
        <Formik
          initialValues={{ bio: bioData }}
          onSubmit={(values) => {
            console.log(values);
            setBioData(values.bio);
            setIsChanging(false);
          }}
        >
          {() => (
            <Form className={classes['bio-form']}>
              <Field name="bio" as="textarea" rows={10} />

              <div className={classes['info-form-btn-container']}>
                <button
                  className="underline-link"
                  type="button"
                  onClick={() => setIsChanging(false)}
                >
                  <AnimatedIcon scale={1.07}>Go Back</AnimatedIcon>
                </button>
                <button className={classes['info-form-btn']} type="submit">
                  <AnimatedIcon scale={1.07}>Save changes</AnimatedIcon>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </InfoBox>
  );
}
