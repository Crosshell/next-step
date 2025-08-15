import { useState } from 'react';

import InfoBox from './InfoBox';

import { UserLanguageData, LanguageData } from '@/types/profile';
import { updateUserLanguages } from '@/services/jobseekerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RequestError from '../RequestErrors/RequestErrors';
import { toClientLangLevel } from '@/utils/convertData';

import { FieldArray, Form, Formik } from 'formik';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';

import { validateLanguages } from '@/utils/profileValidation';
import { ApiError } from '@/types/authForm';
import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '@/services/jobseekerService';
import LanguageRow from '../FormItems/LanguageRow';

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
                      <LanguageRow
                        key={index}
                        index={index}
                        languagesList={languagesList || []}
                        onRemove={() => remove(index)}
                      />
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
