import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import classes from './SearchVacancies.module.css';

export default function InputContainer() {
  return (
    <div className={classes['input-wrapper']}>
      <input
        className={classes['input-container']}
        name="name"
        type="text"
        placeholder="Search for jobs..."
      />
      <button className={classes['search-btn']} type="submit">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}
