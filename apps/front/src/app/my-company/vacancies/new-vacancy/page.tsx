'use client';

import VacancyForm from '@/components/VacanciesItems/VacancyForm';
import classes from './page.module.css';

export default function NewVacancyPage() {
  return (
    <div className="container">
      <div className={classes['page-container']}>
        <h1 className={classes['page-header']}>Create your new vacancy</h1>
        <VacancyForm />
      </div>
    </div>
  );
}
