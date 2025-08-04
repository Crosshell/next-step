import { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestErrors from '../RequestErrors/RequestErrors';

import {
  faPlus,
  faCheck,
  faXmark,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { SkillData, SkillItem } from '@/types/profile';
import {
  createNewSkill,
  getSkills,
  updateSkills,
} from '@/services/jobseekerService';
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

  const { mutateAsync: addNewSkill, isPending: addSkillPending } = useMutation({
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

  const { mutate: updateUserSkills, isPending } = useMutation({
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
            <FieldArray name="skills">
              {({ remove, push }) => {
                const tryAddSkill = () => {
                  const trimmed = values.newSkill.trim();
                  if (!trimmed) return;

                  const existsInForm = values.skills.some(
                    (s) => s.skill.name.toLowerCase() === trimmed.toLowerCase()
                  );
                  if (existsInForm) return;

                  const existingSkill = skillsList?.find(
                    (item) => item.name.toLowerCase() === trimmed.toLowerCase()
                  );

                  if (existingSkill) {
                    push({ skill: existingSkill });
                  } else {
                    push({
                      skill: {
                        id: crypto.randomUUID(),
                        name: trimmed,
                      },
                    });
                  }

                  setFieldValue('newSkill', '');
                };

                return (
                  <Form className={classes.skills}>
                    {values.skills.map((s, index) => (
                      <div key={s.skill.id} className={classes['del-btn-box']}>
                        <span>{s.skill.name}</span>
                        <button
                          type="button"
                          className={classes['del-skill-btn']}
                          onClick={() => remove(index)}
                        >
                          <AnimatedIcon iconType={faTrash} />
                        </button>
                      </div>
                    ))}

                    <div className={classes['autocomplete-wrapper']}>
                      <input
                        type="text"
                        name="newSkill"
                        className={classes['form-input']}
                        placeholder="Search skill"
                        value={values.newSkill}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      {values.newSkill.trim() && (
                        <ul className={classes['autocomplete-list']}>
                          {fetchSkillsError?.message && (
                            <RequestErrors error={fetchSkillsError.message} />
                          )}
                          {skillsList &&
                            skillsList
                              .filter(
                                (item) =>
                                  item.name
                                    .toLowerCase()
                                    .includes(
                                      values.newSkill.trim().toLowerCase()
                                    ) &&
                                  !values.skills.some(
                                    (s) => s.skill.id === item.id
                                  )
                              )
                              .slice(0, 5)
                              .map((item) => {
                                return (
                                  <li
                                    key={item.id}
                                    className={classes['autocomplete-item']}
                                    onClick={() => {
                                      push({ skill: item });
                                      setFieldValue('newSkill', '');
                                    }}
                                  >
                                    {item.name}
                                  </li>
                                );
                              })}
                        </ul>
                      )}
                    </div>

                    <div className={classes['btn-container']}>
                      <button
                        type="button"
                        className={classes['edit-skills-btn']}
                        onClick={tryAddSkill}
                        disabled={addSkillPending}
                      >
                        <AnimatedIcon iconType={faPlus} />
                      </button>
                      <button
                        type="button"
                        className={classes['skills-cross-btn']}
                        onClick={() => setEditMode(false)}
                        disabled={isPending}
                      >
                        <AnimatedIcon iconType={faXmark} />
                      </button>
                      <button
                        type="submit"
                        className={classes['skills-check-btn']}
                        disabled={isPending}
                      >
                        <AnimatedIcon iconType={faCheck} />
                      </button>
                    </div>
                  </Form>
                );
              }}
            </FieldArray>
          )}
        </Formik>
      )}
      <RequestErrors error={requestError} />
    </div>
  );
}
