import AnimatedIcon from '../HoveredItem/HoveredItem';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classes from './SearchVacancies.module.css';

interface Props {
  width: string;
}

export default function InputContainer({ width }: Props) {
  return (
    <div className={classes['input-wrapper']} style={{ width: width }}>
      <input
        className={classes['input-container']}
        name="name"
        type="text"
        placeholder="Search for jobs..."
      />
      <button className={classes['search-btn']} type="submit">
        <AnimatedIcon iconType={faMagnifyingGlass} />
      </button>
    </div>
  );
}
