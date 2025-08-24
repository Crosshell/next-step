import { ErrorMessage, Field } from 'formik';

import MultiSelect from '@/components/MultiSelect/MultiSelect';
import classes from '../SearchVacancies.module.css';

import { workFormatOptions } from '@/lib/vacancy-data';

export default function WorkFormatsInput() {
  return (
    <div className={classes['work-format']}>
      <label>Work Format</label>
      <Field
        name="workFormats"
        component={MultiSelect}
        options={workFormatOptions}
        placeholder="Select format"
        type="search"
      />
      <ErrorMessage
        name="workFormat"
        component="div"
        className={classes['error-msg']}
      />
    </div>
  );
}
