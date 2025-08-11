import { Field, Form, Formik } from 'formik';

import classes from './VacancyForm.module.css';

const fallbackValues = {
  title: 'Cool vacancy',
  description: 'Ex description',
  salaryMin: 0,
  salaryMax: 999,
  officeLocation: 'Hostel number 8',
  experienceRequired: 7,
  workFormat: ['OFFICE', 'REMOTE', 'HYBRID'],
  employmentType: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'],
  seniorityLevel: 'MIDDLE',
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
            <label>Vacancy title</label>
            <Field name="title" className={classes['form-input']} />
          </div>
          <div className={classes.description}>
            <label>Job description</label>
            <Field
              name="description"
              className={classes['form-input']}
              as="textarea"
              rows={10}
            />
          </div>
          <div>
            <label>Salary</label>
            <div className={classes.salary}>
              <div className={classes['salary-item']}>
                <Field name="salaryMin" className={classes['form-input']} />
                <span className={classes.dollar}>$</span>
              </div>

              <div className="align-center">
                <span>-</span>
              </div>

              <div className={classes['salary-item']}>
                <Field name="salaryMax" className={classes['form-input']} />
                <span className={classes.dollar}>$</span>
              </div>
            </div>
          </div>
          <div className={classes.office}>
            <label>Office Location</label>
            <Field name="officeLocation" className={classes['form-input']} />
          </div>
          <div className={classes['office-employment']}>
            <div>
              <label>Work Format</label>
              <Field name="workFormat" className={classes['form-input']} />
            </div>
            <div className={classes.employment}>
              <label>Employment Type</label>
              <Field name="employmentType" className={classes['form-input']} />
            </div>
          </div>
          <div className={classes['experience-seniority']}>
            <div className={classes.experience}>
              <label>Experience</label>
              <Field
                name="experienceRequired"
                className={classes['form-input']}
              />
              <span className={classes.years}>years</span>
            </div>
            <div>
              <label>Seniority</label>
              <Field name="seniorityLevel" className={classes['form-input']} />
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}
