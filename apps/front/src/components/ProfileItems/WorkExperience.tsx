'use client';

import { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import InfoItem from './InfoItem';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

import { ExperienceData } from '@/types/profile';
import { handleExperienceSubmit } from '@/utils/profileValidation';

interface Props {
  isEditable: boolean;
  data: ExperienceData[];
}

export default function WorkExperience({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState(false);
  const [userExperience, setUserExperience] = useState<ExperienceData[]>(data);
  const [tempExp, setTempExp] = useState<ExperienceData[]>(data);

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
    setTempExp(userExperience);
  };

  return (
    <InfoBox
      title="Work Experience"
      isEditable={isEditable}
      onEdit={toggleEdit}
    >
      {!isChanging ? (
        <>
          {userExperience.map((work, idx) => (
            <InfoItem
              key={`${work.companyName}-${idx}`}
              title={work.companyName}
              date={
                work.endDate
                  ? `${work.startDate} - ${work.endDate}`
                  : `From: ${work.startDate}`
              }
            >
              <p>{work.details}</p>
              {work.isCurrent && (
                <span className={classes['is-current']}>Current Job</span>
              )}
            </InfoItem>
          ))}
        </>
      ) : (
        <Formik
          initialValues={{ experience: tempExp }}
          onSubmit={(values, helpers) =>
            handleExperienceSubmit(values, helpers, (updatedExperience) => {
              setUserExperience(updatedExperience);
              setIsChanging(false);
            })
          }
        >
          {({ values, errors }) => (
            <Form>
              <FieldArray name="experience">
                {({ remove, push }) => (
                  <>
                    {values.experience.map((_, index) => (
                      <div key={index} className={classes['experience-group']}>
                        <div className={classes['experience-row']}>
                          <Field
                            name={`experience[${index}].companyName`}
                            placeholder="Company Name"
                            className={classes['form-input']}
                          />
                          <Field
                            name={`experience[${index}].startDate`}
                            placeholder="Start Date"
                            type="date"
                            className={classes['form-input']}
                          />
                          <Field
                            name={`experience[${index}].endDate`}
                            placeholder="End Date"
                            type="date"
                            className={classes['form-input']}
                          />
                          <div
                            className={`align-center ${classes['experience-checkbox']}  ${
                              values.experience[index].isCurrent
                                ? classes['experience-checkbox-active']
                                : ''
                            }`}
                          >
                            <label>
                              Current Job
                              <Field
                                type="checkbox"
                                name={`experience[${index}].isCurrent`}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <Field
                            name={`experience[${index}].details`}
                            placeholder="Details"
                            as="textarea"
                            rows={3}
                            className={`${classes['form-input']} ${classes['form-details']}`}
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

                    {errors.experience &&
                      typeof errors.experience === 'string' && (
                        <div className={classes['error-message']}>
                          {errors.experience}
                        </div>
                      )}

                    <div className={classes['add-save-btn-container']}>
                      <button
                        className={classes['info-form-btn']}
                        type="button"
                        onClick={() =>
                          push({
                            companyName: '',
                            startDate: '',
                            endDate: '',
                            details: '',
                            isCurrent: false,
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
