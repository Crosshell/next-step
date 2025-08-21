import { useState } from 'react';
import classes from './MultiSelect.module.css';
import { capitalize, toKebabCase } from '@/utils/convertData';
import { FieldInputProps, FormikProps } from 'formik';

interface Props {
  field: FieldInputProps<string[]>;
  form: FormikProps<any>;
  options: string[];
  placeholder?: string;
  type?: string;
}

export default function MultiSelect({
  field,
  form,
  options,
  placeholder,
  type,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    let newValue = [...field.value];
    if (newValue.includes(option)) {
      newValue = newValue.filter((v) => v !== option);
    } else {
      newValue.push(option);
    }
    form.setFieldValue(field.name, newValue);
  };

  return (
    <div
      className={classes['multi-select-wrapper']}
      style={{ width: type ? '100%' : '30vw' }}
    >
      <div
        className={`${type === 'search' ? classes['form-input-search'] : classes['form-input']} ${classes['multi-select-display']}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {field.value.length > 0
          ? capitalize(
              field.value.map((v: string) => toKebabCase(v)).join(', ')
            )
          : placeholder || 'Select options'}
      </div>

      {open && (
        <div className={classes['multi-select-options']}>
          {options.map((option: string) => (
            <label key={option} className={classes['multi-select-option']}>
              <span>{capitalize(toKebabCase(option))}</span>
              <input
                type="checkbox"
                checked={field.value.includes(option)}
                onChange={() => toggleOption(option)}
              ></input>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
