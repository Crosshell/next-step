import { Field } from 'formik';

import classes from './Fields.module.css';

import { seniorityOptions } from '@/lib/vacancy-data';
import { capitalize } from '@/utils/convertData';

export default function SeniorityInput() {
  return (
    <>
      <div className={classes['seniority']}>
        <label>Seniority</label>
        <div>
          <Field
            as="select"
            name="seniorityLevel"
            className={classes['form-input']}
          >
            <option value="">Select seniority</option>
            {seniorityOptions.map((option) => (
              <option key={option} value={option}>
                {capitalize(option)}
              </option>
            ))}
          </Field>
        </div>
      </div>
    </>
  );
}
