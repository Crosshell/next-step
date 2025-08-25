'use client';

import { useFormikContext } from 'formik';

import classes from './Fields.module.css';

import { OrderField, VacancySearchForm } from '@/types/vacancies';

interface Props {
  type?: 'vacancies' | 'jobSeekers';
}

export default function SortingFields({ type = 'vacancies' }: Props) {
  const { values, setFieldValue } = useFormikContext<VacancySearchForm>();

  const currentField: OrderField | '' = values.orderBy
    ? (Object.keys(values.orderBy)[0] as OrderField)
    : '';

  const currentDirection: 'asc' | 'desc' | '' =
    currentField && values.orderBy
      ? (values.orderBy[currentField] as 'asc' | 'desc')
      : '';

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value as OrderField | '';
    if (field) {
      setFieldValue('orderBy', { [field]: currentDirection || 'asc' });
    } else {
      setFieldValue('orderBy', {}); // скидаємо якщо нічого не обрали
    }
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as 'asc' | 'desc' | '';
    if (currentField && direction) {
      setFieldValue('orderBy', { [currentField]: direction });
    }
  };

  return (
    <div className={classes['sorting-fields']}>
      <div className={classes['field']}>
        <select
          id="orderByField"
          value={currentField}
          onChange={handleFieldChange}
        >
          <option value="">No sorting</option>
          {type === 'vacancies' ? (
            <>
              <option value="salaryMin">Salary</option>
              <option value="createdAt">Created At</option>
            </>
          ) : (
            <option value="updatedAt">Updated At</option>
          )}
        </select>
      </div>

      <div className={classes['field']}>
        <select
          id="orderByDirection"
          value={currentDirection}
          onChange={handleDirectionChange}
          disabled={!currentField}
        >
          <option value="">Order by</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
