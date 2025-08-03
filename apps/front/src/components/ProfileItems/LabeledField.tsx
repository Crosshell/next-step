'use client';

import { Field, useField } from 'formik';
import classes from './Profile.module.css';

interface Props {
  name: string;
  label: string;
  type?: string;
}

export default function LabeledField({ name, label, type = 'text' }: Props) {
  const [field, meta] = useField(name);

  return (
    <div className={classes['form-field-group']}>
      <p>{label}</p>
      <Field {...field} type={type} name={name} />
      {meta.touched && meta.error && (
        <div className={classes['form-error']}>{meta.error}</div>
      )}
    </div>
  );
}
