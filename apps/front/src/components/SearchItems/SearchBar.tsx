import Link from 'next/link';
import { Form, Formik } from 'formik';

import InputContainer from './InputContainer';
import VacanciesTagBox from './SearchTagBox';
import AnimatedIcon from '../HoveredItem/HoveredItem';

import classes from './SearchVacancies.module.css';

import { vacancySearchDefaults } from '@/lib/vacancy-data';

interface Props {
  addBtn?: boolean;
  onSubmit?: (values: any) => void;
}

export default function SearchBar({
  addBtn = false,
  onSubmit = () => {
    console.log('submitted');
  },
}: Props) {
  return (
    <div className={classes['searchbar-wrapper']}>
      <Formik
        initialValues={vacancySearchDefaults}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (values.title && values.title.length < 10) {
            errors.title = 'Title must be at least 10 characters';
          }
          return errors;
        }}
        onSubmit={(values) => {
          const cleaned = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => {
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'string') return v.trim() !== '';
              if (typeof v === 'number') return v !== 0;
              return v !== undefined && v !== null;
            })
          );

          console.log('cleaned values', cleaned);
          onSubmit(cleaned);
        }}
      >
        <Form className={classes['searchbar-container']}>
          <div className={classes['btn-search-container']}>
            {addBtn && (
              <div>
                <Link
                  href="/my-company/vacancies/new-vacancy"
                  className={classes['add-vacancy-btn']}
                >
                  <AnimatedIcon>Add Vacancy +</AnimatedIcon>
                </Link>
              </div>
            )}
            <InputContainer width={!addBtn ? '100%' : '80%'} />
          </div>
          <VacanciesTagBox />
        </Form>
      </Formik>
    </div>
  );
}
