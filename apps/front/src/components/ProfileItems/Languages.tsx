import { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { LanguageData } from '@/types/profile';
import { languageLevel, languages } from '@/lib/profile-test-data';

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
          onSubmit={(values, { setErrors }) => {
            const seen = new Set();
            const duplicates = values.languages.some((lang) => {
              if (seen.has(lang.language)) return true;
              seen.add(lang.language);
              return false;
            });

            const hasEmptyFields = values.languages.some(
              (lang) => !lang.language || !lang.level
            );

            if (duplicates) {
              setErrors({ languages: 'Languages must be unique' });
              return;
            }

            if (hasEmptyFields) {
              setErrors({ languages: 'All language fields must be filled' });
              return;
            }

            setLanguages(values.languages);
            setIsChanging(false);
          }}
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
                        >
                          <option value="" disabled>
                            Select language
                          </option>
                          {languages.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </Field>

                        <Field
                          as="select"
                          name={`languages[${index}].level`}
                          className={classes['language-level-input']}
                        >
                          <option value="" disabled>
                            Select level
                          </option>
                          {languageLevel.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </Field>

                        <button
                          className={classes['lang-del-btn']}
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

                    <div className={classes['lang-btn-container']}>
                      <button
                        className={classes['bio-btn']}
                        type="button"
                        onClick={() => push({ language: '', level: '' })}
                      >
                        <AnimatedIcon>Add +</AnimatedIcon>
                      </button>

                      <div className={classes['lang-save-btn-container']}>
                        <button
                          className="underline-link"
                          type="button"
                          onClick={() => setIsChanging(false)}
                        >
                          <AnimatedIcon>Go Back</AnimatedIcon>
                        </button>
                        <button className={classes['bio-btn']} type="submit">
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
