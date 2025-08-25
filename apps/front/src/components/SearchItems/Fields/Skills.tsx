import { FieldArray, useFormikContext } from 'formik';
import { getSkills } from '@/services/jobseekerService';
import { useQuery } from '@tanstack/react-query';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestErrors from '@/components/RequestErrors/RequestErrors';

import classes from './Fields.module.css';
import { JobSeekerSearchForm } from '@/types/jobSeekerSearch';

interface Props {
  type?: 'vacancies' | 'jobSeekers';
}

type SkillsFormValues = {
  skillIds?: { skill: { id: string; name?: string } }[];
  requiredSkillIds?: { skill: { id: string; name?: string } }[];
  newSkill: string;
};

export default function SkillsInput({ type = 'vacancies' }: Props) {
  const { values, handleChange, setFieldValue } =
    useFormikContext<SkillsFormValues>();

  const { data: skillsList = [], error: fetchSkillsError } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    retry: false,
  });

  const name = type === 'vacancies' ? 'requiredSkillIds' : 'skillIds';

  return (
    <div className={classes['skills-field']}>
      <label>Skills</label>

      <FieldArray name={name}>
        {({ remove, push }) => {
          const tryAddSkill = () => {
            const trimmed = values.newSkill.trim();
            if (!trimmed) return;

            const existingSkill = skillsList.find(
              (item) => item.name.toLowerCase() === trimmed.toLowerCase()
            );

            if (
              existingSkill &&
              !values[name]?.some((s: any) => s.skill.id === existingSkill.id)
            ) {
              push({ skill: existingSkill });
              setFieldValue('newSkill', '');
            }
          };

          return (
            <div className={classes['skills']}>
              {values[name]?.map((s: any, index: number) => (
                <div key={s.skill.id}>
                  <div className={classes['del-btn-box']}>
                    <span>{s.skill.name}</span>
                    <button
                      type="button"
                      className={classes['del-skill-btn']}
                      onClick={() => remove(index)}
                    >
                      <AnimatedIcon iconType={faTrash} />
                    </button>
                  </div>
                </div>
              ))}

              <div className={classes['autocomplete-wrapper']}>
                <input
                  type="text"
                  name="newSkill"
                  className={classes['form-input']}
                  placeholder="Add skill"
                  value={values.newSkill}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {values.newSkill.trim() && (
                  <ul className={classes['autocomplete-list']}>
                    {fetchSkillsError?.message && (
                      <RequestErrors error={fetchSkillsError.message} />
                    )}
                    {skillsList
                      .filter(
                        (item) =>
                          item.name
                            .toLowerCase()
                            .includes(values.newSkill.trim().toLowerCase()) &&
                          !values[name]?.some(
                            (s: any) => s.skill.id === item.id
                          )
                      )
                      .slice(0, 5)
                      .map((item) => (
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
                      ))}
                  </ul>
                )}
                <button
                  type="button"
                  className={classes['edit-skills-btn']}
                  onClick={tryAddSkill}
                >
                  <AnimatedIcon iconType={faPlus} />
                </button>
              </div>
            </div>
          );
        }}
      </FieldArray>
    </div>
  );
}
