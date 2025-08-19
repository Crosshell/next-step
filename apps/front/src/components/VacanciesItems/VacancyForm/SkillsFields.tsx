import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import classes from './VacancyForm.module.css';
import { getSkills } from '@/services/jobseekerService';
import { VacancyFormValues } from '@/types/vacancy';
import SkillsRow from '@/components/FormItems/SkillRow';

export default function SkillsFields() {
  const { values, handleChange, setFieldValue } =
    useFormikContext<VacancyFormValues>();

  const { data: skillsList = [], error: fetchSkillsError } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
    <div className={classes['lang-form']}>
      <p>Skills</p>
      <SkillsRow
        values={values}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        skillsList={skillsList}
        fetchSkillsError={fetchSkillsError}
      />
    </div>
  );
}
