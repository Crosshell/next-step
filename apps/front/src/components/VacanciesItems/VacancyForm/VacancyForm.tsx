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
import { createVacancy } from '@/services/vacanciesService';

export default function VacancyForm() {
  const [requestError, setRequestError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: createVacancyMutate } = useMutation({
    mutationFn: createVacancy,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      // console.log(languages);

      // try {
      //   await updateVacancyLanguages({
      //     id: result.data.id,
      //     data: languages,
      //   });
      // } catch (err) {
      //   console.error('Failed to update languages:', err);
      // }

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
          console.log(values);
          createVacancyMutate(values);
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
