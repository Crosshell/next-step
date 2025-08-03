import { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';

import InfoBox from './InfoBox';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { LanguageData, UserLanguageData } from '@/types/profile';
import { clientLanguageLevels, languageLevels } from '@/lib/profile-data';
import { handleLanguagesSubmit } from '@/utils/profileValidation';
import { getLanguages, updateUserLanguages } from '@/services/jobseekerService';
import { ApiError } from '@/types/authForm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RequestError from '../RequestErrors/RequestErrors';
import { toClientLangLevel } from '@/utils/convertData';

interface Props {
  isEditable: boolean;
  data: UserLanguageData[];
}

export default function Languages({ isEditable, data }: Props) {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: languagesList = [], error: fetchLangError } = useQuery<
    LanguageData[] | null,
    ApiError
  >({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    mutate: updateLanguages,
    isPending,
    error: updateLangError,
  } = useMutation({
    mutationFn: updateUserLanguages,
    onSuccess: async (result) => {
      if (result.status === 'error') return;
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

      setEditMode(false);
    },
  });

  const toggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <InfoBox title="Languages" isEditable={isEditable} onEdit={toggleEdit}>
      {!editMode ? (
        <>
          {data.length > 0 ? (
            data.map((lang) => (
              <p key={lang.language.id} className="row-space-between">
                <span>{lang.language.name}</span>
                <span>{toClientLangLevel(lang.level)}</span>
              </p>
            ))
          ) : (
            <p>No languages there yet</p>
          )}
        </>
      ) : (
        <Formik
          initialValues={{ languages: data }}
          onSubmit={(values, helpers) =>
            handleLanguagesSubmit(values, helpers, () => {
              updateLanguages(
                values.languages.map((lang) => ({
                  languageId: lang.language.id,
                  level: lang.level,
                }))
              );
            })
          }
        >
          {({ errors, values }) => (
            <Form>
              <FieldArray name="languages">
                {({ remove, push }) => (
                  <>
                    {values.languages.map((lang, index) => (
                      <div key={index} className={classes['language-row']}>
                        <Field
                          as="select"
                          name={`languages[${index}].language.id`}
                          className={classes['form-input']}
                        >
                          <option value="" disabled>
                            Select language
                          </option>
                          {languagesList?.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.name}
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
                          {languageLevels.map((level, index) => (
                            <option key={level} value={level}>
                              {clientLanguageLevels[index]}
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

                    <RequestError error={fetchLangError?.message} />

                    <div className={classes['add-save-btn-container']}>
                      <button
                        className={classes['info-form-btn']}
                        type="button"
                        onClick={() =>
                          push({ language: { id: '' }, level: '' })
                        }
                      >
                        <AnimatedIcon>Add +</AnimatedIcon>
                      </button>

                      <div className={classes['save-btns-container']}>
                        <button
                          className="underline-link"
                          type="button"
                          onClick={() => setEditMode(false)}
                        >
                          <AnimatedIcon>Go Back</AnimatedIcon>
                        </button>
                        <button
                          className={classes['info-form-btn']}
                          type="submit"
                          disabled={isPending}
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
      <RequestError error={updateLangError?.message} />
    </InfoBox>
  );
}
