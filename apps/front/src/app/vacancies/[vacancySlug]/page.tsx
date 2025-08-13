'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import SideBox from '@/components/Vacancy/SideBox';
import SideBoxButton from '@/components/Vacancy/SideBoxButton';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { VacancyData } from '@/types/vacancies';
import { ApiError } from '@/types/authForm';
import { getVacancyById } from '@/services/vacanciesService';

export default function VacancyPage() {
  const params = useParams();
  const vacancyId = params.vacancySlug as string;

  const { data, isPending, error, isError } = useQuery<
    VacancyData | null,
    ApiError
  >({
    queryKey: ['vacancy', vacancyId],
    queryFn: () => getVacancyById(vacancyId),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const date = new Date();
  const dateString = date.toLocaleDateString('en-GB');

  if (isPending)
    return (
      <MessageBox>
        <p>Wait while we are loading this vacancy...</p>
      </MessageBox>
    );

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  return (
    <div className="container">
      <div className={classes['vacancy-container']}>
        <div className={classes['main-info']}>
          <h2>Job Details</h2>

          <h1>{data?.title}</h1>
          <p className={classes['details']}>{data?.description}</p>
          <section>
            <h3>Experience</h3>
            <p>{data?.experienceRequired} years</p>
          </section>
          <section>
            <h3>Seniority</h3>
            <p>{data?.seniorityLevel}</p>{' '}
          </section>
          <div className={classes['date-views-row']}>
            <h4>
              Posted: <span>{dateString}</span>
            </h4>
          </div>
          <SideBoxButton />
        </div>
        <SideBox
          data={{
            companyName: data?.company.name ?? '',
            companyLogo: data?.company.logoUrl ?? '',
            companyUrl: data?.company.url ?? '',
            employmentType: data?.employmentType ?? [],
            workFormat: data?.workFormat ?? [],
            officeLocation: data?.officeLocation ?? '',
          }}
        />
      </div>
    </div>
  );
}
