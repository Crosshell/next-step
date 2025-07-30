import { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { LanguageData } from '@/types/profile';
import { languageLevels, languagesList } from '@/lib/profile-data';
import { handleLanguagesSubmit } from '@/utils/profileValidation';

interface Props {
  isEditable: boolean;
  data: LanguageData[];
}

export default function Languages({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [userLanguages, setLanguages] = useState<LanguageData[]>(data);
  const [tempLanguages, setTempLanguages] = useState<LanguageData[]>(data);

  const toggleEdit = () => {
    setIsChanging((prev) => !prev);
    setTempLanguages(userLanguages);
  };

  return (
    <InfoBox title="Languages" isEditable={isEditable} onEdit={toggleEdit}>
      {!isChanging ? (
        <>
          {userLanguages.map((lang) => {
            return (
              <p key={lang.language} className="row-space-between">
                <span>{lang.language}</span>
                <span>{lang.level}</span>
              </p>
            );
          })}
        </>
      ) : (
        <Formik
          initialValues={{ languages: tempLanguages }}
          onSubmit={(values, helpers) =>
            handleLanguagesSubmit(values, helpers, (updatedLanguages) => {
              setLanguages(updatedLanguages);
              setIsChanging(false);
            })
          }
        >
          {({ errors, values }) => (
            <Form>
              <FieldArray name="languages">
                {({ remove, push }) => (
                  <>
                    {values.languages.map((_, index) => (
                      <div key={index} className={classes['language-row']}>
                        <Field
                          as="select"
                          name={`languages[${index}].language`}
                          className={classes['form-input']}
                        >
                          <option value="" disabled>
                            Select language
                          </option>
                          {languagesList.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </Field>

                        <Field
                          as="select"
                          name={`languages[${index}].level`}
                          className={classes['form-input']}
                        >
                          <option value="" disabled>
                            Select level
                          </option>
                          {languageLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </Field>

                        <button
                          className={classes['form-del-btn']}
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <AnimatedIcon iconType={faTrash} />
                        </button>
                      </div>
                    ))}

                    {errors.languages &&
                      typeof errors.languages === 'string' && (
                        <div>{errors.languages}</div>
                      )}

                    <div className={classes['add-save-btn-container']}>
                      <button
                        className={classes['info-form-btn']}
                        type="button"
                        onClick={() => push({ language: '', level: '' })}
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
