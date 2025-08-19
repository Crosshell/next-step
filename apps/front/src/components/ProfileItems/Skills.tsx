import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestErrors from '../RequestErrors/RequestErrors';

import { faCheck, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { SkillData, SkillItem } from '@/types/profile';
import {
  createNewSkill,
  getSkills,
  updateSkills,
} from '@/services/jobseekerService';
import SkillsRow from '../FormItems/SkillRow';
import { ApiError } from '@/types/authForm';

interface Props {
  isEditable: boolean;
  skills: SkillData[];
}

export default function Skills({ isEditable, skills }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: skillsList = [], error: fetchSkillsError } = useQuery<
    SkillItem[] | null,
    ApiError
  >({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const { mutateAsync: addNewSkill } = useMutation({
    mutationFn: createNewSkill,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }

      setRequestError(null);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      const createdSkill = result.data;

      return createdSkill;
    },
  });

  const { mutate: updateUserSkills } = useMutation({
    mutationFn: updateSkills,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditMode(false);
    },
  });

  return (
    <div>
      {!editMode ? (
        <div className={classes.skills}>
          {skills.length > 0 ? (
            skills.map((s) => <span key={s.skill.id}>{s.skill.name}</span>)
          ) : (
            <span className={classes['no-skills']}>No skills added</span>
          )}
          {isEditable && (
            <button
              type="button"
              className={classes['edit-skills-btn']}
              onClick={() => setEditMode(true)}
            >
              <AnimatedIcon iconType={faPlus} />
            </button>
          )}
        </div>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{ skills: skills, newSkill: '' }}
          onSubmit={async (values) => {
            const notExistingSkills =
              skillsList &&
              values.skills.filter(
                (formSkill) =>
                  !skillsList.some(
                    (available) => formSkill.skill.name === available.name
                  )
              );

            if (notExistingSkills?.length) {
              for (const item of notExistingSkills) {
                const result = await addNewSkill({ name: item.skill.name });

                if (result.status === 'ok') {
                  values.skills = values.skills.map((s) =>
                    s.skill.name === item.skill.name
                      ? { skill: result.data }
                      : s
                  );
                } else {
                  setRequestError(result.error);
                }
              }
            }

            updateUserSkills({
              skillIds: values.skills.map((s) => s.skill.id),
            });
          }}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className={classes['skills-form']}>
              <SkillsRow
                values={values}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                skillsList={skillsList}
                fetchSkillsError={fetchSkillsError}
              />
              <div className={classes['btn-container']}>
                <button
                  type="button"
                  className={classes['skills-cross-btn']}
                  onClick={() => setEditMode(false)}
                >
                  <AnimatedIcon iconType={faXmark} />
                </button>
                <button type="submit" className={classes['skills-check-btn']}>
                  <AnimatedIcon iconType={faCheck} />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <RequestErrors error={requestError} />
    </div>
  );
}
