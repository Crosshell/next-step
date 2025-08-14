'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import SideBox from '@/components/VacanciesItems/VacancyPage/SideBox';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { VacancyData } from '@/types/vacancies';
import { ApiError } from '@/types/authForm';
import { capitalize, toKebabCase } from '@/utils/convertData';
import {
  deleteVacancy as deleteVacancyFn,
  getVacancyById,
} from '@/services/vacanciesService';
import Cookies from 'js-cookie';

export default function VacancyPage() {
  const params = useParams();
  const [requestError, setRequestError] = useState<string | null>(null);
  const router = useRouter();
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

  const { mutate: deleteVacancy } = useMutation({
    mutationFn: deleteVacancyFn,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
      router.push('/my-company/vacancies/');
    },
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
            <h3>Required Experience</h3>
            <p>{data?.experienceRequired} years</p>
          </section>
          <section>
            <h3>Seniority</h3>
            {data?.seniorityLevel && <p>{capitalize(data.seniorityLevel)}</p>}
          </section>
          {data?.requiredLanguages && data?.requiredLanguages.length > 0 && (
            <section>
              <h3>Required Languages</h3>
              {data?.requiredLanguages.length > 0 &&
                data?.requiredLanguages.map((lang) => (
                  <p key={lang.language.id}>
                    {lang.language.name} - {capitalize(toKebabCase(lang.level))}
                  </p>
                ))}
            </section>
          )}

          <section>
            <div className={classes['date-views-row']}>
              <h4>
                Posted: <span>{data?.createdAt}</span>
              </h4>
            </div>
          </section>

          {!companyId && (
            <button className={classes['apply-btn']}>
              <AnimatedIcon>Apply for a job</AnimatedIcon>
            </button>
          )}

          {requestError && (
            <div className={classes['error-container']}>
              <MessageBox>{requestError}</MessageBox>;
            </div>
          )}

          {companyId === data?.company.id && (
            <div className={classes['bottom-row']}>
              <Link
                href={`/my-company/vacancies/edit-vacancy/${data?.id}`}
                className={classes['edit-link']}
              >
                <AnimatedIcon>Edit vacancy</AnimatedIcon>
              </Link>
              <button
                className={classes['del-btn']}
                onClick={() => deleteVacancy(data?.id)}
              >
                <AnimatedIcon>Delete vacancy</AnimatedIcon>
              </button>
            </div>
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
