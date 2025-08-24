import { VacancySearchForm } from '@/types/vacancies';
import { Field, FieldProps } from 'formik';

import classes from './Fields.module.css';

export default function SalarySlider() {
  return (
    <div className={classes['salary']}>
      <label htmlFor="salaryMin">Minimal Salary</label>
      <Field name="salaryMin">
        {({
          field,
          form,
        }: FieldProps<number | undefined, VacancySearchForm>) => (
          <div>
            <input
              type="range"
              id="salaryMin"
              min="0"
              max="5000"
              step="100"
              {...field}
              value={field.value}
              onChange={(e) => form.setFieldValue('salaryMin', e.target.value)}
            />
            <span style={{ marginLeft: '10px' }}>{field.value} $</span>
          </div>
        )}
      </Field>
    </div>
  );
}
