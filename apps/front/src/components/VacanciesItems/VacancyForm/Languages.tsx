import classes from './VacancyForm.module.css';
import { useVacancyStore } from '@/store/useVacancyStore';

export default function Languages() {
  const { setLanguages } = useVacancyStore();

  return (
    <div className={classes['lang-form']}>
      <p>Languages</p>
    </div>
  );
}
