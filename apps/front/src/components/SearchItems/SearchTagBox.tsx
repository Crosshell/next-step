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

interface Props {
  type?: 'vacancies' | 'jobSeekers';
}

export default function VacanciesTagBox({ type = 'vacancies' }: Props) {
  const [moreFilters, setMoreFilters] = useState<boolean>(
    type === 'jobSeekers' ? true : false
  );

  return (
    <div className={classes['tag-box']}>
      <h3>Add filters:</h3>
      {type === 'vacancies' && (
        <>
          <SalarySlider />
          <ExperienceInput />
        </>
      )}
      <SeniorityInput />
      {type === 'vacancies' && (
        <>
          <WorkFormatsInput />
          <EmploymentTypesInput />
        </>
      )}
      {moreFilters && (
        <>
          <LanguagesInput />
          <SkillsInput />
          <h3>Add sorting:</h3>
          <OrderFields />
        </>
      )}

      {type === 'vacancies' && (
        <button
          className={classes['more-btn']}
          type="button"
          onClick={() => setMoreFilters((prev) => !prev)}
        >
          {moreFilters ? 'Less filters' : 'More filters...'}
        </button>
      )}
    </div>
  );
}
