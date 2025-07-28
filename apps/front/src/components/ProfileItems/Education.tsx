'use client';

import { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import InfoItem from './InfoItem';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

import { EducationData } from '@/types/profile';
import { degreeTypes } from '@/lib/profile-test-data';
import { handleEducationSubmit } from '@/utils/profileValidation';

interface Props {
  isEditable: boolean;
  data: EducationData[];
}

export default function Education({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState(false);
  const [userEducation, setUserEducation] = useState<EducationData[]>(data);
  const [tempEducation, setTempEducation] = useState<EducationData[]>(data);

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
    setTempEducation(userEducation);
  };

  return (
    <InfoBox title="High Education" isEditable={isEditable} onEdit={toggleEdit}>
      {!isChanging ? (
        <>
          {userEducation.map((education, idx) => (
            <InfoItem
              key={`${education.universityName}-${idx}`}
              title={education.universityName}
              date={
                education.endDate
                  ? `${education.startDate} - ${education.endDate}`
                  : `From: ${education.startDate}`
              }
            >
              <p className="row-space-between">
                <span className="font-weight-500 font-size-1-5">
                  {education.field}
                </span>
                <span className="font-weight-500 font-size-1-5">
                  {education.degree}
                </span>
              </p>
              <p>{education.details}</p>
            </InfoItem>
          ))}
        </>
      ) : (
        <Formik
          initialValues={{ education: tempEducation }}
          onSubmit={(values, helpers) =>
            handleEducationSubmit(values, helpers, (updatedEducation) => {
              setUserEducation(updatedEducation);
              setIsChanging(false);
            })
          }
        >
          {({ values, errors }) => (
            <Form>
              <FieldArray name="education">
                {({ remove, push }) => (
                  <>
                    {values.education.map((_, index) => (
                      <div key={index} className={classes['experience-group']}>
                        <div
                          className={`${classes['experience-row']} ${classes['education-row']}`}
                        >
                          <Field
                            name={`education[${index}].universityName`}
                            placeholder="University Name"
                            className={classes['form-input']}
                          />
                          <Field
                            name={`education[${index}].startDate`}
                            placeholder="Start Date"
                            type="date"
                            className={classes['form-input']}
                          />
                          <Field
                            name={`education[${index}].endDate`}
                            placeholder="End Date"
                            type="date"
                            className={classes['form-input']}
                          />
                          <Field
                            name={`education[${index}].field`}
                            placeholder="Field of Study"
                            className={classes['form-input']}
                          />
                          <Field
                            as="select"
                            name={`education[${index}].degree`}
                            className={classes['language-level-input']}
                          >
                            <option value="" disabled>
                              Select degree
                            </option>
                            {degreeTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div>
                          <Field
                            name={`education[${index}].details`}
                            placeholder="Details"
                            as="textarea"
                            rows={3}
                            className={classes['experience-details']}
                          />
                        </div>
                        <button
                          className={`${classes['form-del-btn']} ${classes['experience-del-btn']}`}
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <AnimatedIcon>Delete</AnimatedIcon>
                        </button>
                      </div>
                    ))}

                    {errors.education &&
                      typeof errors.education === 'string' && (
                        <div className={classes['error-message']}>
                          {errors.education}
                        </div>
                      )}

                    <div className={classes['add-save-btn-container']}>
                      <button
                        className={classes['info-form-btn']}
                        type="button"
                        onClick={() =>
                          push({
                            universityName: '',
                            startDate: '',
                            endDate: '',
                            field: '',
                            degree: '',
                            details: '',
                          })
                        }
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
