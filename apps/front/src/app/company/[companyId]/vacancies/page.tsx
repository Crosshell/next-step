'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import VacancyItem from '@/components/VacanciesItems/VacancyItem';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { ApiError } from '@/types/authForm';
import { VacancyData } from '@/types/vacancies';
import { getCompanyVacancies } from '@/services/companiesSearchService';

export default function CompanyVacancies() {
  const params = useParams();
  const companyId = params.companyId as string;

  const {
    data: myVacancies,
    isPending,
    error,
    isError,
  } = useQuery<VacancyData[] | null, ApiError>({
    queryKey: ['company-vacancies'],
    queryFn: () => getCompanyVacancies(companyId),
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

  if (isPending)
    return (
      <MessageBox>
        <p>Loading profile, wait a second... </p>
      </MessageBox>
    );

  return (
    <div className="container">
      <div className={classes['page-container']}>
        <h1 className={classes['page-header']}>
          {myVacancies && myVacancies.length > 0
            ? myVacancies[0].company.name + "'s"
            : "Company's"}{' '}
          Vacancies
        </h1>
        <div className={classes['vacancies-container']}>
          {myVacancies &&
          Array.isArray(myVacancies) &&
          myVacancies.length > 0 ? (
            myVacancies.map((vacancyData) => (
              <VacancyItem
                key={vacancyData.id}
                data={{
                  id: vacancyData.id,
                  title: vacancyData.title,
                  companyName: vacancyData.company.name,
                  companyLogo: vacancyData.company.logoUrl,
                  createdAt: vacancyData.createdAt,
                }}
              />
            ))
          ) : (
            <p className={classes['no-vacancies']}>No vacancies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
