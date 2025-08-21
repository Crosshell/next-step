'use client';

import { useQuery } from '@tanstack/react-query';
import classes from './page.module.css';
import SearchBar from '@/components/SearchItems/SearchBar';
import { ApiError } from '@/types/authForm';
import { getMyVacancies } from '@/services/vacanciesService';
import { VacancyData } from '@/types/vacancies';
import VacancyItem from '@/components/VacanciesItems/VacancyItem';
import MessageBox from '@/components/MessageBox/MessageBox';

export default function CompanyVacancies() {
  const {
    data: myVacancies,
    isPending,
    error,
    isError,
  } = useQuery<VacancyData[] | null, ApiError>({
    queryKey: ['company-profile'],
    queryFn: getMyVacancies,
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
          Your Company&apos;s Vacancies
        </h1>
        <SearchBar addBtn={true} />
        <div className={classes['vacancies-container']}>
          {myVacancies && Array.isArray(myVacancies) ? (
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
            <p>No vacancies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
