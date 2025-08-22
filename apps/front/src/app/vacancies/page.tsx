'use client';

import VacancyItem from '@/components/VacanciesItems/VacancyItem';

import classes from './page.module.css';

import SearchBar from '@/components/SearchItems/SearchBar';
import { searchVacancies } from '@/services/vacanciesService';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { VacancyData } from '@/types/vacancies';
import { isEmptyValue, mapQueryToVacancyForm } from '@/utils/vacancyValidation';
import MessageBox from '@/components/MessageBox/MessageBox';
import { VacancyFormValues } from '@/types/vacancy';

export default function VacanciesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryData = Object.fromEntries(searchParams.entries());
  const vacancyForm = mapQueryToVacancyForm(queryData);

  const {
    data: vacanciesData,
    isError,
    error,
  } = useQuery({
    queryKey: ['vacancies', queryData],
    queryFn: () => searchVacancies(vacancyForm),
  });

  const updateUrl = (values: VacancyFormValues) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (isEmptyValue(value)) return;

      if (typeof value === 'object' && !Array.isArray(value)) {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    });

    console.log(params);
    router.push(`?${params.toString()}`);
  };

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tear jobs </h1>
      <SearchBar onSubmit={updateUrl} />
      <div className={classes['vacancies-container']}>
        {vacanciesData &&
          vacanciesData.data.map((vacancyData: VacancyData) => {
            return (
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
            );
          })}
      </div>
    </div>
  );
}
