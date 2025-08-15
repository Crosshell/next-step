import { FieldArray, ErrorMessage } from 'formik';
import { useQuery } from '@tanstack/react-query';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import LanguageRow from '@/components/FormItems/LanguageRow';
import classes from './VacancyForm.module.css';
import { LanguageData } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import { getLanguages } from '@/services/jobseekerService';

export default function LanguagesFields() {
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
    <div className={classes['lang-form']}>
      <p>Languages</p>

      <FieldArray name="languages">
        {({ push, remove, form }) => (
          <>
            {form.values.languages.map((lang: any, index: number) => (
              <LanguageRow
                key={index}
                index={index}
                languagesList={languagesList || []}
                onRemove={() => remove(index)}
              />
            ))}

            <ErrorMessage
              name="languages"
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
              onClick={() => push({ languageId: '', level: '' })}
            >
              <AnimatedIcon>Add +</AnimatedIcon>
            </button>
          </>
        )}
      </FieldArray>
    </div>
  );
}
