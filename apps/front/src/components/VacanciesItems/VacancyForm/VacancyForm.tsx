import AnimatedIcon from '../../HoveredItem/HoveredItem';
import Languages from './Languages';
import MainInfoForm from './MainInfoForm';
import classes from './VacancyForm.module.css';

export default function VacancyForm() {
  return (
    <div className={classes['vacancy-form']}>
      <MainInfoForm />
      <Languages />
      <div className="row-end">
        <button
          type="submit"
          form="vacancy-main-info-form"
          className={classes['submit-btn']}
        >
          <AnimatedIcon>Create Vacancy</AnimatedIcon>
        </button>
      </div>
    </div>
  );
}
