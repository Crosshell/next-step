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
import { companiesSearchDefaults } from '@/lib/companies-search-data';
import { submitCompaniesSearchForm } from '@/utils/companiesSearchValidation';
import { CompaniesSearchForm } from '@/types/companiesSearch';

interface Props {
  type?: 'vacancies' | 'companies' | 'jobSeekers';
  onSubmit?: (values: any) => void;
  fieldsValues: VacancySearchForm | CompaniesSearchForm;
}

export default function SearchBar({
  fieldsValues,
  type = 'vacancies',
  onSubmit = () => {
    console.log('submitted');
  },
}: Props) {
  let defaultValues = {};
  let validate;
  let submit: any;
  if (type === 'vacancies') {
    defaultValues = vacancySearchDefaults;
    validate = searchFormValidate;
    submit = submitSearchForm;
  }
  if (type === 'companies') {
    defaultValues = companiesSearchDefaults;
    submit = submitCompaniesSearchForm;
  }

  return (
    <div className={classes['searchbar-wrapper']}>
      <Formik
        initialValues={{ ...defaultValues, ...fieldsValues }}
        validate={validate}
        onSubmit={(values) => submit(values, onSubmit)}
      >
        <Form className={classes['searchbar-container']}>
          <div
            className={classes['btn-search-container']}
            style={{ width: type === 'companies' ? '100%' : '' }}
          >
            <InputContainer type={type} />
          </div>
          {type !== 'companies' && <VacanciesTagBox />}
        </Form>
      </Formik>
    </div>
  );
}
