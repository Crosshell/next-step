import EmploymentTypesInput from './Fields/EmploymentTypes';
import ExperienceInput from './Fields/Experience';
import LanguagesInput from './Fields/Languages';
import SalarySlider from './Fields/SalarySlider';
import SeniorityInput from './Fields/Seniority';
import SkillsInput from './Fields/Skills';
import WorkFormatsInput from './Fields/WorkFormats';

import classes from './SearchVacancies.module.css';

export default function VacanciesTagBox() {
  return (
    <div className={classes['tag-box']}>
      <h3>Add filters:</h3>
      <SalarySlider />
      <ExperienceInput />
      <SeniorityInput />
      <WorkFormatsInput />
      <EmploymentTypesInput />
      <LanguagesInput />
      <SkillsInput />
    </div>
  );
}
