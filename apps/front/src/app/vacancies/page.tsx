'use client';
import { Suspense } from 'react';

import VacancyItem from '@/components/VacanciesItems/VacancyItem';
import LoadingPage from '../loading-out';

import classes from './page.module.css';

import { vacanciesData } from '@/lib/test-data';
import SearchBar from '@/components/SearchItems/SearchBar';

export default function VacanciesPage() {
  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tear jobs </h1>
      <SearchBar />
      <Suspense fallback={<LoadingPage />}>
        {vacanciesData.map((vacancyData) => {
          return <VacancyItem key={vacancyData.id} data={vacancyData} />;
        })}
      </Suspense>
    </div>
  );
}
