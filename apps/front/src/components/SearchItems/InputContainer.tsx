import AnimatedIcon from '../HoveredItem/HoveredItem';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classes from './SearchVacancies.module.css';
import { ErrorMessage, Field } from 'formik';

interface Props {
  width: string;
}

export default function InputContainer({ width }: Props) {
  return (
    <div className={classes['input-wrapper']} style={{ width: width }}>
      <Field
        className={classes['input-container']}
        name="title"
        placeholder="Search for jobs..."
      />
      <ErrorMessage name="title" component="div" />
      <button className={classes['search-btn']} type="submit">
        <AnimatedIcon iconType={faMagnifyingGlass} />
      </button>
    </div>
  );
}
