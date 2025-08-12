import { Field, Form, Formik } from 'formik';

import AnimatedIcon from '../HoveredItem/HoveredItem';
import classes from './VacancyForm.module.css';
import {
  employmentTypeOptions,
  seniorityOptions,
  workFormatOptions,
} from '@/lib/vacancy-data';
import { capitalize } from '@/utils/convertData';
import MultiSelect from '../MultiSelect/MultiSelect';

const fallbackValues = {
  title: '',
  description: '',
  salaryMin: '',
  salaryMax: '',
  officeLocation: '',
  experienceRequired: '',
  workFormat: [],
  employmentType: [],
  seniorityLevel: '',
};

export default function VacancyForm() {
  return (
    <>
      <Formik
        initialValues={fallbackValues}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form className={classes['vacancy-form']}>
          <div className={classes.title}>
            <p>Vacancy title</p>
            <Field
              name="title"
              className={classes['form-input']}
              placeholder="Cool vacancy"
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
          </div>
          <div>
            <p>Salary</p>
            <div className={classes.salary}>
              <div className={classes['salary-item']}>
                <Field
                  name="salaryMin"
                  className={classes['form-input']}
                  type="number"
                  placeholder="0"
                />
                <span className={classes.dollar}>$</span>
              </div>

              <div className="align-center">
                <span>-</span>
              </div>

              <div className={classes['salary-item']}>
                <Field
                  name="salaryMax"
                  className={classes['form-input']}
                  type="number"
                  placeholder="999"
                />
                <span className={classes.dollar}>$</span>
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
            </div>
            <div className={classes.employment}>
              <p>Employment Type</p>
              <Field
                name="employmentType"
                component={MultiSelect}
                options={employmentTypeOptions}
                placeholder="Select employment type"
              />
            </div>
          </div>
          <div className={classes['experience-seniority']}>
            <div className={classes.experience}>
              <p>Experience</p>
              <Field
                name="experienceRequired"
                className={classes['form-input']}
                type="number"
                placeholder="0"
              />
              <span className={classes.years}>years</span>
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
            </div>
          </div>
          <div className="row-end">
            <button type="submit" className={classes['submit-btn']}>
              <AnimatedIcon>Create Vacancy</AnimatedIcon>
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
