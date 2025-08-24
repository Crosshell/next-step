'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import SearchBar from '@/components/SearchItems/SearchBar';
import MessageBox from '@/components/MessageBox/MessageBox';
import CompanyItem from '@/components/CompaniesSearchItems/CompanyItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import classes from './page.module.css';

import { CompaniesSearchForm, CompanyData } from '@/types/companiesSearch';
import { mapQueryToCompaniesForm } from '@/utils/companiesSearchValidation';
import { isEmptyValue } from '@/utils/vacancyValidation';
import { searchCompanies } from '@/services/companiesSearchService';

import Cookies from 'js-cookie';

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryData = Object.fromEntries(searchParams.entries());
  const companyForm = mapQueryToCompaniesForm(queryData);

  const [role, setRole] = useState<string | undefined>();

  useEffect(() => {
    setRole(Cookies.get('role'));
  }, []);

  const {
    data: companiesData,
    isError,
    error,
  } = useQuery({
    queryKey: ['companies', queryData],
    queryFn: () => searchCompanies(companyForm),
  });

  const updateUrl = (values: CompaniesSearchForm) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (isEmptyValue(value)) return;
      params.set(key, String(value));
    });

    router.push(`?${params.toString()}`);
  };

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading companies: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tier jobs </h1>
      <SearchBar
        type={'companies'}
        onSubmit={updateUrl}
        fieldsValues={companyForm}
      />
      {role && (
        <Link href="/vacancies">
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
        {companiesData &&
          companiesData.data.map((companyData: CompanyData) => {
            return (
              <CompanyItem
                key={companyData.id}
                data={{
                  id: companyData.id,
                  name: companyData.name,
                  url: companyData.url ?? '',
                  logoUrl: companyData.logoUrl ?? '',
                  createdAt: companyData.createdAt,
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
