'use client';
import { useRef } from 'react';

import InputContainer from '@/components/SearchVacancies/InputContainer';
import VacanciesTagBox from '@/components/SearchVacancies/VacanciesTagBox';
import VacancyItem from '@/components/SearchVacancies/VacancyItem';

import classes from './page.module.css';

export default function Vacancies() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    console.log(JSON.stringify(Object.fromEntries(formData), null, 2));
  };
  return (
    <div className="container">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={classes['search-form']}
      >
        <InputContainer />
        <VacanciesTagBox />
        <VacancyItem />
        <VacancyItem />
        <VacancyItem />
      </form>
    </div>
  );
}
