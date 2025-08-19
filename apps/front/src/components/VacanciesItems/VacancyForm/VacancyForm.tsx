import { Form, Formik } from 'formik';
import AnimatedIcon from '../../HoveredItem/HoveredItem';
import LanguagesFields from './LanguagesFields';
import MainInfoFields from './MainInfoFields';
import classes from './VacancyForm.module.css';
import MessageBox from '@/components/MessageBox/MessageBox';
import { vacancyFallbackValues } from '@/lib/vacancy-data';
import { validateVacancyForm } from '@/utils/vacancyValidation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  createVacancy,
  updateVacancyLanguages,
  updateVacancySkills,
} from '@/services/vacanciesService';
import SkillsFields from './SkillsFields';
import {
  createNewSkill as createNewSkillFn,
  getSkills,
} from '@/services/jobseekerService';
import { addMissingSkills } from '@/utils/skillsConvertData';

export default function VacancyForm() {
  const [requestError, setRequestError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: updateLanguages } = useMutation({
    mutationFn: updateVacancyLanguages,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
    },
  });

  const { mutate: updateSkills } = useMutation({
    mutationFn: updateVacancySkills,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
    },
  });

  const { mutate: createVacancyMutate } = useMutation({
    mutationFn: createVacancy,
    onSuccess: async (result, variables) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }

      const vacancyId = result.data.id;

      if (variables.languages.length > 0) {
        updateLanguages({
          id: vacancyId,
          data: variables.languages,
        });
      }

      if (variables.skills.length > 0) {
        const skillIds = variables.skills.map((s) => s.skill.id);
        updateSkills({ id: vacancyId, data: skillIds });
      }

      setRequestError(null);
      router.push('/my-company/vacancies/');
    },
  });

  const { mutateAsync: createNewSkill } = useMutation({
    mutationFn: createNewSkillFn,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      return result.data;
    },
  });

  return (
    <div className={classes['vacancy-form']}>
      <Formik
        initialValues={vacancyFallbackValues}
        validate={validateVacancyForm}
        onSubmit={async (values) => {
          const skillsList = await getSkills();

          const updatedSkills = await addMissingSkills(
            { skills: values.skills, newSkill: values.newSkill },
            skillsList,
            createNewSkill,
            setRequestError
          );

          const cleaned = {
            ...values,
            skills: updatedSkills ?? [],
            languages: values.languages.map((l) => ({
              languageId: l.language?.id ?? l.languageId,
              level: l.level,
            })),
          };

          createVacancyMutate(cleaned);
        }}
      >
        <Form id="vacancy-form" className={classes['main-info-form']}>
          <MainInfoFields />

          <SkillsFields />

          <LanguagesFields />
          {requestError && (
            <div className={classes['error-container']}>
              <MessageBox>{requestError}</MessageBox>
            </div>
          )}
          <div className="row-end">
            <button type="submit" className={classes['submit-btn']}>
              <AnimatedIcon>Create Vacancy</AnimatedIcon>
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
