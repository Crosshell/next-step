import { Field, FieldArray, Form, Formik } from 'formik';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestError from '../RequestErrors/RequestErrors';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './FormItems.module.css';

import {
  LanguageData,
  UpdatedUserLanguages,
  UserLanguageData,
} from '@/types/profile';
import { clientLanguageLevels, languageLevels } from '@/lib/profile-data';
import { validateLanguages } from '@/utils/profileValidation';
import { ApiError } from '@/types/authForm';
import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '@/services/jobseekerService';

interface Props {
  data?: UserLanguageData[];
  updateLanguages: (data: UpdatedUserLanguages[]) => void;
  isPending: boolean;
  goBack?: () => void;
}

export default function LanguagesForm({
  data,
  updateLanguages,
  isPending,
  goBack,
}: Props) {
  const { data: languagesList = [], error: fetchLangError } = useQuery<
    LanguageData[] | null,
    ApiError
  >({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
    <Formik
      initialValues={{ languages: data ? data : [] }}
      validate={validateLanguages}
      onSubmit={(values) =>
        updateLanguages(
          values.languages.map((lang) => ({
            languageId: lang.language.id,
            level: lang.level,
          }))
        )
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

                {errors.languages && typeof errors.languages === 'string' && (
                  <div>{errors.languages}</div>
                )}

                <RequestError error={fetchLangError?.message} />

                <div className={classes['add-save-btn-container']}>
                  <button
                    className={classes['info-form-btn']}
                    type="button"
                    onClick={() => push({ language: { id: '' }, level: '' })}
                  >
                    <AnimatedIcon>Add +</AnimatedIcon>
                  </button>

                  <div className={classes['save-btns-container']}>
                    {goBack && (
                      <button
                        className="underline-link"
                        type="button"
                        onClick={() => goBack()}
                      >
                        <AnimatedIcon>Go Back</AnimatedIcon>
                      </button>
                    )}

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
  );
}
