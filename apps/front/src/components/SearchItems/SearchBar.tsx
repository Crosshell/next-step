import Link from 'next/link';

import InputContainer from './InputContainer';
import VacanciesTagBox from './SearchTagBox';
import AnimatedIcon from '../HoveredItem/HoveredItem';

import classes from './SearchVacancies.module.css';

interface Props {
  addBtn?: boolean;
}

export default function SearchBar({ addBtn = false }: Props) {
  return (
    <div className={classes['searchbar-container']}>
      {addBtn && (
        <Link
          href="/my-company/vacancies/new-vacancy"
          className={classes['add-vacancy-btn']}
        >
          <AnimatedIcon>Add Vacancy +</AnimatedIcon>
        </Link>
      )}
      <InputContainer width={!addBtn ? '75%' : '60%'} />
      <VacanciesTagBox />
    </div>
  );
}
