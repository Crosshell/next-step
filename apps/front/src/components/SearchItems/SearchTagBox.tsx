import classes from './SearchVacancies.module.css';

export default function VacanciesTagBox() {
  return (
    <div className={classes['tag-box']}>
      <h3>Filter by:</h3>
      <ul>
        <li className={classes['radio']}>
          <input type="radio" name="filter" value="newest" />
          <label>Newest</label>
        </li>
        <li className={classes['radio']}>
          <input type="radio" name="filter" value="oldest" />
          <label>Oldest</label>
        </li>
      </ul>
    </div>
  );
}
