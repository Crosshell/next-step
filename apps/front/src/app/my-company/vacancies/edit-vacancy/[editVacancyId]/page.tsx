'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import VacancyForm from '@/components/VacanciesItems/VacancyForm/VacancyForm';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { VacancyData } from '@/types/vacancies';
import { ApiError } from '@/types/authForm';
import { getVacancyById } from '@/services/vacanciesService';
import { mapVacancyToFormValues } from '@/utils/vacancyValidation';

export default function EditVacancy() {
  const params = useParams();
  const vacancyId = params.editVacancyId as string;

  const { data, error, isError } = useQuery<VacancyData | null, ApiError>({
    queryKey: ['vacancy', vacancyId],
    queryFn: () => getVacancyById(vacancyId),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  return (
    <div className="container">
      <div className={classes['page-container']}>
        <h1 className={classes['page-header']}>Edit your vacancy</h1>
        <VacancyForm
          data={data ? mapVacancyToFormValues(data) : null}
          type={'EDIT'}
        />
      </div>
    </div>
  );
}
