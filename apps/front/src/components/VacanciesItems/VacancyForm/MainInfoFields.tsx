import { Field, ErrorMessage, useFormikContext } from 'formik';
import classes from './VacancyForm.module.css';

import {
  employmentTypeOptions,
  seniorityOptions,
  workFormatOptions,
} from '@/lib/vacancy-data';
import { capitalize } from '@/utils/convertData';

import MultiSelect from '../../MultiSelect/MultiSelect';
import HoveredItem from '@/components/HoveredItem/HoveredItem';
import { VacancyFormValues } from '@/types/vacancy';

export default function MainInfoForm() {
  const { values, setFieldValue } = useFormikContext<VacancyFormValues>();

  const toggleActive = () => {
    setFieldValue('isActive', !values.isActive);
  };

  console.log(values);

  return (
    <>
      <div>
        <p>Vacancy title</p>
        <div className={classes['title-is-active']}>
          <div className={classes.title}>
            <Field
              name="title"
              className={classes['form-input']}
              placeholder="Cool vacancy"
            />
          </div>
          <button
            type="button"
            onClick={toggleActive}
            className={
              values.isActive
                ? classes['is-active-btn']
                : classes['is-not-active-btn']
            }
          >
            <HoveredItem>
              {values.isActive ? 'Is Active ' : 'Not Active '}
            </HoveredItem>
          </button>
        </div>
        <ErrorMessage
          name="title"
          component="div"
          className={classes['error-msg']}
        />
      </div>

      <div className={classes.description}>
        <p>Job description</p>
        <Field
          name="description"
          className={classes['form-input']}
          as="textarea"
          rows={10}
          placeholder="Some info..."
        />
        <ErrorMessage
          name="description"
          component="div"
          className={classes['error-msg']}
        />
      </div>

      <div>
        <p>Salary</p>
        <div className={classes.salary}>
          <div>
            <div className={classes['salary-item']}>
              <Field name="salaryMin" type="number" placeholder="0" />
              <div className="align-center">
                <span className={classes.dollar}>$</span>
              </div>
            </div>
            <ErrorMessage
              name="salaryMin"
              component="div"
              className={classes['error-msg']}
            />
          </div>
          <div>
            <span>-</span>
          </div>
          <div>
            <div className={classes['salary-item']}>
              <Field name="salaryMax" type="number" placeholder="999" />
              <div className="align-center">
                <span className={classes.dollar}>$</span>
              </div>
            </div>
            <ErrorMessage
              name="salaryMax"
              component="div"
              className={classes['error-msg']}
            />
          </div>
        </div>
      </div>

      <div className={classes.office}>
        <p>Office Location</p>
        <Field
          name="officeLocation"
          className={classes['form-input']}
          placeholder="Hostel number 8"
        />
        <ErrorMessage
          name="officeLocation"
          component="div"
          className={classes['error-msg']}
        />
      </div>

      <div className={classes['office-employment']}>
        <div>
          <p>Work Format</p>
          <Field
            name="workFormat"
            component={MultiSelect}
            options={workFormatOptions}
            placeholder="Select work format"
          />
          <ErrorMessage
            name="workFormat"
            component="div"
            className={classes['error-msg']}
          />
        </div>

        <div className={classes.employment}>
          <p>Employment Type</p>
          <Field
            name="employmentType"
            component={MultiSelect}
            options={employmentTypeOptions}
            placeholder="Select employment type"
          />
          <ErrorMessage
            name="employmentType"
            component="div"
            className={classes['error-msg']}
          />
        </div>
      </div>

      <div className={classes['experience-seniority']}>
        <div className={classes.experience}>
          <p>Experience</p>
          <div className={classes['experience-item']}>
            <Field name="experienceRequired" type="number" placeholder="0" />
            <div className="align-center">
              <span className={classes.years}>years</span>
            </div>
          </div>
          <ErrorMessage
            name="experienceRequired"
            component="div"
            className={classes['error-msg']}
          />
        </div>

        <div>
          <p>Seniority</p>
          <Field
            as="select"
            name="seniorityLevel"
            className={classes['form-input']}
          >
            <option value="">Select seniority</option>
            {seniorityOptions.map((option) => (
              <option key={option} value={option}>
                {capitalize(option)}
              </option>
            ))}
          </Field>
          <ErrorMessage
            name="seniorityLevel"
            component="div"
            className={classes['error-msg']}
          />
        </div>
      </div>
    </>
  );
}
