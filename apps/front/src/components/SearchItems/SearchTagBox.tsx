import ExperienceInput from './Fields/Experience';
import SalarySlider from './Fields/SalarySlider';
import SeniorityInput from './Fields/Seniority';
import classes from './SearchVacancies.module.css';

export default function VacanciesTagBox() {
  return (
    <div className={classes['tag-box']}>
      <h3>Add filters:</h3>
      <SalarySlider />
      <ExperienceInput />
      <SeniorityInput />
    </div>
  );
}
