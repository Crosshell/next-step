'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import InfoItem from './InfoItem';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { CertificateData } from '@/types/profile';
import { handleCertificatesSubmit } from '@/utils/profileValidation';

interface Props {
  isEditable: boolean;
  data: CertificateData[];
}

export default function Certificates({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState(false);
  const [certificates, setCertificates] = useState<CertificateData[]>(data);
  const [tempCerts, setTempCerts] = useState<CertificateData[]>(data);

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
    setTempCerts(certificates);
  };

  return (
    <InfoBox title="Certificates" isEditable={isEditable} onEdit={toggleEdit}>
      {!isChanging ? (
        <>
          {certificates.map((cert) => (
            <InfoItem key={cert.name} title={cert.name} date={cert.date}>
              <p>
                Url: <Link href={cert.url}>{cert.url}</Link>
              </p>
            </InfoItem>
          ))}
        </>
      ) : (
        <Formik
          initialValues={{ certs: tempCerts }}
          onSubmit={(values, helpers) =>
            handleCertificatesSubmit(values, helpers, (updatedCerts) => {
              setCertificates(updatedCerts);
              setIsChanging(false);
            })
          }
        >
          {({ values, errors }) => (
            <Form>
              <FieldArray name="certs">
                {({ remove, push }) => (
                  <>
                    {values.certs.map((cert, index) => (
                      <div key={index} className={classes['certificates-row']}>
                        <Field
                          name={`certs[${index}].name`}
                          type="text"
                          placeholder="Certificate Name"
                          className={classes['form-input']}
                        />

                        <Field
                          name={`certs[${index}].date`}
                          type="date"
                          className={classes['form-input']}
                        />

                        <Field
                          name={`certs[${index}].url`}
                          type="text"
                          placeholder="Certificate URL"
                          className={classes['form-input']}
                        />

                        <button
                          type="button"
                          className={classes['form-del-btn']}
                          onClick={() => remove(index)}
                        >
                          <AnimatedIcon iconType={faTrash} />
                        </button>
                      </div>
                    ))}

                    {errors.certs && typeof errors.certs === 'string' && (
                      <div className={classes['error-message']}>
                        {errors.certs}
                      </div>
                    )}

                    <div className={classes['add-save-btn-container']}>
                      <button
                        type="button"
                        className={classes['info-form-btn']}
                        onClick={() => push({ name: '', url: '', date: '' })}
                      >
                        <AnimatedIcon>Add +</AnimatedIcon>
                      </button>

                      <div className={classes['save-btns-container']}>
                        <button
                          className="underline-link"
                          type="button"
                          onClick={() => setIsChanging(false)}
                        >
                          <AnimatedIcon>Go Back</AnimatedIcon>
                        </button>
                        <button
                          className={classes['info-form-btn']}
                          type="submit"
                        >
                          <AnimatedIcon>Save changes</AnimatedIcon>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      )}
    </InfoBox>
  );
}
