import { Form, Formik } from 'formik';
import AnimatedIcon from '../../HoveredItem/HoveredItem';
import LanguagesFields from './LanguagesFields';
import MainInfoFields from './MainInfoFields';
import classes from './VacancyForm.module.css';
import MessageBox from '@/components/MessageBox/MessageBox';
import { vacancyFallbackValues } from '@/lib/vacancy-data';
import { validateVacancyForm } from '@/utils/vacancyValidation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  createVacancy,
  updateVacancyLanguages,
} from '@/services/vacanciesService';

export default function VacancyForm() {
  const [requestError, setRequestError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: updateLanguages } = useMutation({
    mutationFn: updateVacancyLanguages,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
    },
  });

  const { mutate: createVacancyMutate } = useMutation({
    mutationFn: createVacancy,
    onSuccess: async (result, variables) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }

      const vacancyId = result.data.id;

      if (variables.languages.length > 0) {
        updateLanguages({
          id: vacancyId,
          data: variables.languages,
        });
      }

      setRequestError(null);
      router.push('/my-company/vacancies/');
    },
  });

  return (
    <div className={classes['vacancy-form']}>
      <Formik
        initialValues={vacancyFallbackValues}
        validate={validateVacancyForm}
        onSubmit={(values) => {
          const cleaned = {
            ...values,
            languages: values.languages.map((l) => ({
              languageId: l.language?.id ?? l.languageId,
              level: l.level,
            })),
          };
          createVacancyMutate(cleaned);
        }}
      >
        <Form id="vacancy-form" className={classes['main-info-form']}>
          <MainInfoFields />
          <LanguagesFields />
          {requestError && (
            <div className={classes['error-container']}>
              <MessageBox>{requestError}</MessageBox>
            </div>
          )}
          <div className="row-end">
            <button type="submit" className={classes['submit-btn']}>
              <AnimatedIcon>Create Vacancy</AnimatedIcon>
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
