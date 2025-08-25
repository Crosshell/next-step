'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import SearchBar from '@/components/SearchItems/SearchBar';
import MessageBox from '@/components/MessageBox/MessageBox';
import JobSeekerItem from '@/components/JobSeekersSearchItems/JobSeekerItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import classes from './page.module.css';

import {
  JobSeekerItemData,
  JobSeekerSearchForm,
} from '@/types/jobSeekerSearch';
import { mapQueryToJobSeekerForm } from '@/utils/jobSeekerSearchValidation';
import { isEmptyValue } from '@/utils/vacancyValidation';
import { searchJobSeekers } from '@/services/jobSeekerSearchService';

export default function JobSeekersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryData = Object.fromEntries(searchParams.entries());

  const jobSeekerForm = mapQueryToJobSeekerForm(queryData);

  const {
    data: jobSeekersData,
    isError,
    error,
  } = useQuery({
    queryKey: ['job-seekers', queryData],
    queryFn: () => searchJobSeekers(jobSeekerForm),
  });

  const updateUrl = (values: JobSeekerSearchForm) => {
    console.log(values);
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (isEmptyValue(value)) return;

      if (key === 'skillIds' && Array.isArray(value)) {
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
        <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tier jobs </h1>
      <SearchBar
        type={'jobSeekers'}
        onSubmit={updateUrl}
        fieldsValues={jobSeekerForm}
      />

      <Link href="/vacancies">
        <div className={classes['link-to-companies']}>
          <span>Search for vacancies</span>
          <div className="align-center">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </Link>

      <div className={classes['vacancies-container']}>
        {jobSeekersData &&
          jobSeekersData.data.map((vacancyData: JobSeekerItemData) => {
            return (
              <JobSeekerItem
                key={vacancyData.id}
                data={{
                  id: vacancyData.id,
                  firstName: vacancyData.firstName,
                  lastName: vacancyData.lastName,
                  avatarUrl: vacancyData.avatarUrl,
                  dateOfBirth: vacancyData.dateOfBirth,
                  createdAt: vacancyData.createdAt,
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
