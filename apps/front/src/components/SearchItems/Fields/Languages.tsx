import { ErrorMessage, FieldArray } from 'formik';
import { useQuery } from '@tanstack/react-query';

import HoveredItem from '@/components/HoveredItem/HoveredItem';
import LanguageRow from '@/components/FormItems/LanguageRow';

import classes from './Fields.module.css';

import { LanguageData, UpdatedUserLanguages } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import { getLanguages } from '@/services/jobseekerService';

export default function LanguagesInput() {
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
    <div className={classes['languages']}>
      <label>Languages</label>

      <FieldArray name="requiredLanguages">
        {({ push, remove, form }) => (
          <>
            {form.values.requiredLanguages.map(
              (lang: UpdatedUserLanguages, index: number) => (
                <LanguageRow
                  key={index}
                  index={index}
                  languagesList={languagesList || []}
                  onRemove={() => remove(index)}
                  type="tagBox"
                />
              )
            )}

            <ErrorMessage
              name="requiredLanguages"
              component="div"
              className={classes['error-msg']}
            />

            {fetchLangError && (
              <div className={classes['error-msg']}>
                {fetchLangError.message}
              </div>
            )}

            <button
              type="button"
              className={classes['info-form-btn']}
              onClick={() => push({ language: { id: '' }, level: '' })}
            >
              <HoveredItem>Add +</HoveredItem>
            </button>
          </>
        )}
      </FieldArray>
    </div>
  );
}
