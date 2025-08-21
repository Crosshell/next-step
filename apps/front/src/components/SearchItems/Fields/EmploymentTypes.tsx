import { ErrorMessage, Field } from 'formik';
import MultiSelect from '@/components/MultiSelect/MultiSelect';

import classes from '../SearchVacancies.module.css';
import { employmentTypeOptions } from '@/lib/vacancy-data';

export default function EmploymentTypesInput() {
  return (
    <div>
      <label>Employment Type</label>
      <Field
        name="employmentTypes"
        component={MultiSelect}
        options={employmentTypeOptions}
        placeholder="Select employment"
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
