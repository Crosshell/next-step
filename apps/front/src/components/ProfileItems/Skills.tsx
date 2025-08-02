import { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestErrors from '../RequestErrors/RequestErrors';

import {
  faPlus,
  faCheck,
  faXmark,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { SkillData } from '@/types/profile';
import { updateSkills } from '@/services/jobseekerService';

interface Props {
  skills: SkillData[];
}

export default function Skills({ skills }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [requestErrors, setRequestErrors] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { mutate: updateUserSkills, isPending } = useMutation({
    mutationFn: updateSkills,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestErrors([result.error]);
        return;
      }
      setRequestErrors([]);
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
          <button
            type="button"
            className={classes['edit-skills-btn']}
            onClick={() => setEditMode(true)}
          >
            <AnimatedIcon iconType={faPlus} />
          </button>
        </div>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{ skills: skills, newSkill: '' }}
          onSubmit={(values) => {
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
                  const exists = values.skills.some(
                    (s) => s.skill.name.toLowerCase() === trimmed.toLowerCase()
                  );
                  if (trimmed && !exists) {
                    push({
                      skill: {
                        id: crypto.randomUUID(),
                        name: trimmed,
                      },
                    });
                    setFieldValue('newSkill', '');
                  }
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

                    <input
                      type="text"
                      name="newSkill"
                      className={classes['form-input']}
                      placeholder="Enter new skill"
                      value={values.newSkill}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          tryAddSkill();
                        }
                      }}
                    />

                    <div className={classes['btn-container']}>
                      <button
                        type="button"
                        className={classes['edit-skills-btn']}
                        onClick={tryAddSkill}
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
      <RequestErrors errors={requestErrors} />
    </div>
  );
}
