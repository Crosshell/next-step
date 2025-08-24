import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';

import AnimatedIcon from '../../HoveredItem/HoveredItem';
import LanguagesFields from './LanguagesFields';
import MainInfoFields from './MainInfoFields';
import SkillsFields from './SkillsFields';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './VacancyForm.module.css';

import { vacancyFallbackValues } from '@/lib/vacancy-data';
import { addMissingSkills } from '@/utils/skillsConvertData';
import { validateVacancyForm } from '@/utils/vacancyValidation';
import {
  createVacancy,
  editVacancy,
  updateVacancyLanguages,
  updateVacancySkills,
} from '@/services/vacanciesService';
import {
  createNewSkill as createNewSkillFn,
  getSkills,
} from '@/services/jobseekerService';
import { VacancyFormValues } from '@/types/vacancy';

interface Props {
  data?: VacancyFormValues | null;
  type?: 'CREATE' | 'EDIT';
}

export default function VacancyForm({ data, type = 'CREATE' }: Props) {
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

  const { mutate: editVacancyMutate } = useMutation({
    mutationFn: editVacancy,
    onSuccess: async (result, variables) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }

      const vacancyId = result.data.id;

      if (variables.data.languages.length > 0) {
        updateLanguages({
          id: vacancyId,
          data: variables.data.languages,
        });
      }

      if (variables.data.skills.length > 0) {
        const skillIds = variables.data.skills.map((s) => s.skill.id);
        updateSkills({ id: vacancyId, data: skillIds });
      }

      setRequestError(null);
      router.push(`/vacancies/${data?.id}`);
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
        initialValues={data ? data : vacancyFallbackValues}
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

          if (type === 'CREATE') createVacancyMutate(cleaned);
          else editVacancyMutate({ id: data?.id ?? '', data: cleaned });
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
              <AnimatedIcon>
                {type === 'CREATE' ? 'Create' : 'Save'} Vacancy
              </AnimatedIcon>
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
