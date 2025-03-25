import classes from './CompanyInfos.module.css';

export default function VacancyItem() {
  return (
    <div className={classes['vacancy-item']}>
      <span>Vacancy Name</span>
      <span className={classes['posted-time']}>
        posted about millennium ago
      </span>
    </div>
  );
}
