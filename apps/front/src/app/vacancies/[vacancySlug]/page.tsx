import React, { Suspense } from 'react';

import SideBox from '@/components/Vacancy/SideBox';
import SideBoxButton from '@/components/Vacancy/SideBoxButton';
import LoadingPage from '@/app/loading-out';

import classes from './page.module.css';

import { Vacancy } from '@/types/vacancy';
import { vacanciesData } from '@/lib/test-data';

interface Props {
  params: Promise<{ vacancySlug: string }>;
}

const getVacancyById = (id: string): Vacancy | undefined => {
  return vacanciesData.find((vacancy) => vacancy.id === id);
};

export default function VacancyPage({ params }: Props) {
  const { vacancySlug } = React.use(params);

  const data = getVacancyById(vacancySlug);
  const date = new Date();
  const dateString = date.toLocaleDateString('en-GB');

  return (
    <div className="container">
      <div className={classes['vacancy-container']}>
        <div className={classes['main-info']}>
          <h2>Job Details</h2>
          <Suspense fallback={<LoadingPage />}>
            <>
              <h1>{data?.title}</h1>
              <p className={classes['details']}>{data?.description}</p>
              <section>
                <h3>Experience</h3>
                <p>{data?.experience_required} years</p>
              </section>
              <section>
                <h3>Seniority</h3>
                <p>{data?.seniority_level}</p>{' '}
              </section>
              <div className={classes['date-views-row']}>
                <h4>
                  Posted: <span>{dateString}</span>
                </h4>
                <h4>
                  Views: <span>{data?.views}</span>
                </h4>
              </div>
              <SideBoxButton />
            </>
          </Suspense>
        </div>
        <SideBox data={data} />
      </div>
    </div>
  );
}
