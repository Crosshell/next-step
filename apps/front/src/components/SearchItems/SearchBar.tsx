import { Form, Formik } from 'formik';

import InputContainer from './InputContainer';
import SearchTagBox from './SearchTagBox';

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
import { jobSeekerSearchDefaults } from '@/lib/jobseeker-search-data';
import { submitJobSeekersSearchForm } from '@/utils/jobSeekerSearchValidation';
import { JobSeekerSearchForm } from '@/types/jobSeekerSearch';
import { validateLanguages } from '@/utils/profileValidation';

interface Props {
  type?: 'vacancies' | 'companies' | 'jobSeekers';
  onSubmit?: (values: any) => void;
  fieldsValues: VacancySearchForm | CompaniesSearchForm | JobSeekerSearchForm;
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
  if (type === 'jobSeekers') {
    defaultValues = jobSeekerSearchDefaults;
    validate = validateLanguages;
    submit = submitJobSeekersSearchForm;
  }

  return (
    <div
      className={classes['searchbar-wrapper']}
      style={{ marginBottom: type === 'jobSeekers' ? 0 : '' }}
    >
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
            {type !== 'jobSeekers' && <InputContainer type={type} />}
          </div>
          {type !== 'companies' && <SearchTagBox type={type} />}
        </Form>
      </Formik>
    </div>
  );
}
