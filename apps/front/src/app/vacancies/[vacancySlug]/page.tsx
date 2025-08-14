'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import HoveredItem from '@/components/HoveredItem/HoveredItem';
import SideBox from '@/components/Vacancy/SideBox';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { VacancyData } from '@/types/vacancies';
import { ApiError } from '@/types/authForm';
import { getVacancyById } from '@/services/vacanciesService';
import { capitalize } from '@/utils/convertData';
import Cookies from 'js-cookie';

export default function VacancyPage() {
  const params = useParams();
  const vacancyId = params.vacancySlug as string;
  const companyId = Cookies.get('company-id');

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

  console.log(data);

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
            {data?.seniorityLevel && <p>{capitalize(data.seniorityLevel)}</p>}
          </section>
          <div className={classes['date-views-row']}>
            <h4>
              Posted: <span>{data?.createdAt}</span>
            </h4>
          </div>

          {!companyId && (
            <button className={classes['apply-btn']}>
              <HoveredItem>Apply for a job</HoveredItem>
            </button>
          )}

          {companyId === data?.company.id && (
            <Link
              href={`/my-company/vacancies/edit-vacancy/${data?.id}`}
              className={classes['edit-link']}
            >
              <HoveredItem>Edit vacancy</HoveredItem>
            </Link>
          )}
        </div>
        <SideBox
          data={{
            id: data?.id ?? '',
            companyId: data?.company.id ?? '',
            companyName: data?.company.name ?? '',
            companyLogo: data?.company.logoUrl ?? '',
            companyUrl: data?.company.url ?? '',
            employmentType: data?.employmentType ?? [],
            workFormat: data?.workFormat ?? [],
            officeLocation: data?.officeLocation ?? '',
            salaryMin: data?.salaryMin ?? 0,
            salaryMax: data?.salaryMax ?? 0,
          }}
        />
      </div>
    </div>
  );
}
