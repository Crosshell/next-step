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
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { searchCompanies } from '@/services/companiesSearchService';

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryData = Object.fromEntries(searchParams.entries());
  console.log('queryData', queryData);

  const vacancyForm = mapQueryToVacancyForm(queryData);

  const [role, setRole] = useState<string | undefined>();

  useEffect(() => {
    setRole(Cookies.get('role'));
  }, []);

  const {
    data: vacanciesData,
    isError,
    error,
  } = useQuery({
    queryKey: ['vacancies', queryData],
    queryFn: () => searchCompanies(vacancyForm),
  });

  const updateUrl = (values: VacancyFormValues) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (isEmptyValue(value)) return;

      if (key === 'requiredSkillIds' && Array.isArray(value)) {
        if (value.length) params.set(key, value.join(','));
      } else if (Array.isArray(value)) {
        if (
          value.every((v) => typeof v === 'string' || typeof v === 'number')
        ) {
          params.set(key, value.join(','));
        } else {
          params.set(key, JSON.stringify(value));
        }
      } else if (typeof value === 'object') {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  };

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading companies: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  console.log(vacancyForm);

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tier jobs </h1>
      <SearchBar onSubmit={updateUrl} fieldsValues={vacancyForm} />
      {role && (
        <Link href="/companies">
          <div className={classes['link-to-companies']}>
            {role === 'JOB_SEEKER' && <span>Search for vacancies</span>}
            {role === 'COMPANY' && <span>Search for job-seekers</span>}
            <div className="align-center">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>
        </Link>
      )}

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
