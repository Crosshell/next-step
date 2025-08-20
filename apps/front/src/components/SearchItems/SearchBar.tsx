import Link from 'next/link';
import { Form, Formik } from 'formik';

import InputContainer from './InputContainer';
import VacanciesTagBox from './SearchTagBox';
import AnimatedIcon from '../HoveredItem/HoveredItem';

import classes from './SearchVacancies.module.css';

import { vacancySearchDefaults } from '@/lib/vacancy-data';

interface Props {
  addBtn?: boolean;
}

export default function SearchBar({ addBtn = false }: Props) {
  return (
    <div className={classes['searchbar-wrapper']}>
      <Formik
        initialValues={vacancySearchDefaults}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form className={classes['searchbar-container']}>
          <div className={classes['btn-search-container']}>
            {addBtn && (
              <Link
                href="/my-company/vacancies/new-vacancy"
                className={classes['add-vacancy-btn']}
              >
                <AnimatedIcon>Add Vacancy +</AnimatedIcon>
              </Link>
            )}
            <InputContainer width={!addBtn ? '100%' : '85%'} />
          </div>
          <VacanciesTagBox />
        </Form>
      </Formik>
    </div>
  );
}
