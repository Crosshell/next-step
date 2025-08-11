import classes from './page.module.css';
import SearchBar from '@/components/SearchVacancies/SearchBar';

export default function CompanyVacancies() {
  return (
    <div className="container">
      <div className={classes['page-container']}>
        <h1 className={classes['page-header']}>
          Your Company&apos;s Vacancies
        </h1>
        <SearchBar addBtn={true} />
      </div>
    </div>
  );
}
