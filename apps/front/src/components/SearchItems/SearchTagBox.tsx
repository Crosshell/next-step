'use client';

import { useState } from 'react';

import EmploymentTypesInput from './Fields/EmploymentTypes';
import ExperienceInput from './Fields/Experience';
import LanguagesInput from './Fields/Languages';
import SortingFields from './Fields/SortingFields';
import SalarySlider from './Fields/SalarySlider';
import SeniorityInput from './Fields/Seniority';
import SkillsInput from './Fields/Skills';
import WorkFormatsInput from './Fields/WorkFormats';
import HoveredItem from '../HoveredItem/HoveredItem';

import classes from './SearchVacancies.module.css';

interface Props {
  type?: 'vacancies' | 'jobSeekers';
}

export default function SearchTagBox({ type = 'vacancies' }: Props) {
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
          <SeniorityInput />
          <WorkFormatsInput />
          <EmploymentTypesInput />
        </>
      )}
      {moreFilters && (
        <>
          <LanguagesInput type={type} />
          <SkillsInput type={type} />
          <h3>Add sorting:</h3>
          <SortingFields type={'jobSeekers'} />
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
      {type === 'jobSeekers' && (
        <button type="submit" className={classes['tags-search-btn']}>
          <HoveredItem>Search</HoveredItem>
        </button>
      )}
    </div>
  );
}
