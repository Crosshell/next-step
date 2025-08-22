import Link from 'next/link';
import { Form, Formik } from 'formik';

import InputContainer from './InputContainer';
import VacanciesTagBox from './SearchTagBox';
import AnimatedIcon from '../HoveredItem/HoveredItem';

import classes from './SearchVacancies.module.css';

import { vacancySearchDefaults } from '@/lib/vacancy-data';
import {
  searchFormValidate,
  submitSearchForm,
} from '@/utils/vacancyValidation';
import { VacancySearchForm } from '@/types/vacancies';

interface Props {
  addBtn?: boolean;
  onSubmit?: (values: any) => void;
  fieldsValues: VacancySearchForm;
}

export default function SearchBar({
  addBtn = false,
  onSubmit = () => {
    console.log('submitted');
  },
  fieldsValues,
}: Props) {
  return (
    <div className={classes['searchbar-wrapper']}>
      <Formik
        initialValues={{ ...vacancySearchDefaults, ...fieldsValues }}
        validate={searchFormValidate}
        onSubmit={(values) => submitSearchForm(values, onSubmit)}
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
