import { Form, Formik } from 'formik';

import InputContainer from './InputContainer';
import VacanciesTagBox from './SearchTagBox';

import classes from './SearchVacancies.module.css';

import { vacancySearchDefaults } from '@/lib/vacancy-data';
import {
  searchFormValidate,
  submitSearchForm,
} from '@/utils/vacancyValidation';
import { VacancySearchForm } from '@/types/vacancies';

interface Props {
  onSubmit?: (values: any) => void;
  fieldsValues: VacancySearchForm;
}

export default function SearchBar({
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
            <InputContainer />
          </div>
          <VacanciesTagBox />
        </Form>
      </Formik>
    </div>
  );
}
