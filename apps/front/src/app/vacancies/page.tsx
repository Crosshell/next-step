'use client';
import { Suspense, useRef } from 'react';

import VacancyItem from '@/components/SearchVacancies/VacancyItem';
import LoadingPage from '../loading-out';

import classes from './page.module.css';

import { vacanciesData } from '@/lib/test-data';
import SearchBar from '@/components/SearchVacancies/SearchBar';

export default function VacanciesPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    console.log(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Search for top-tear jobs </h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={classes['search-form']}
      >
        <SearchBar />
        <Suspense fallback={<LoadingPage />}>
          {vacanciesData.map((vacancyData) => {
            return <VacancyItem key={vacancyData.id} data={vacancyData} />;
          })}
        </Suspense>
      </form>
    </div>
  );
}
