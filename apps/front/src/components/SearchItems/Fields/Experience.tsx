import { Field } from 'formik';

import classes from '../SearchVacancies.module.css';

export default function ExperienceInput() {
  return (
    <>
      <div className={classes['experience-container']}>
        <label>Experience</label>

        <div className={classes['experience']}>
          <Field
            name="experienceRequired"
            type="number"
            className={classes['form-input']}
          />
          <div className="align-center">
            <span>years</span>
          </div>
        </div>
      </div>
    </>
  );
}
