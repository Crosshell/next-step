import EmploymentTypesInput from './Fields/EmploymentTypes';
import ExperienceInput from './Fields/Experience';
import LanguagesInput from './Fields/Languages';
import OrderFields from './Fields/SortingFields';
import SalarySlider from './Fields/SalarySlider';
import SeniorityInput from './Fields/Seniority';
import SkillsInput from './Fields/Skills';
import WorkFormatsInput from './Fields/WorkFormats';

import classes from './SearchVacancies.module.css';
import { useState } from 'react';

export default function VacanciesTagBox() {
  const [moreFilters, setMoreFilters] = useState<boolean>(false);

  return (
    <div className={classes['tag-box']}>
      <h3>Add filters:</h3>
      <SalarySlider />
      <ExperienceInput />
      <SeniorityInput />
      <WorkFormatsInput />
      <EmploymentTypesInput />
      {moreFilters && (
        <>
          <LanguagesInput />
          <SkillsInput />
          <h3>Add sorting:</h3>
          <OrderFields />
        </>
      )}

      <button
        className={classes['more-btn']}
        type="button"
        onClick={() => setMoreFilters((prev) => !prev)}
      >
        {moreFilters ? 'Less filters' : 'More filters...'}
      </button>
    </div>
  );
}
