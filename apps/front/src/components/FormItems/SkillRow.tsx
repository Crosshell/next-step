import { FieldArray, FormikValues } from 'formik';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import RequestErrors from '../RequestErrors/RequestErrors';

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './FormItems.module.css';

import { SkillData, SkillItem } from '@/types/profile';

interface Props {
  values: FormikValues;
  handleChange: (e: React.ChangeEvent<any>) => void;
  setFieldValue: (field: string, value: any) => void;
  skillsList: SkillItem[] | null;
  fetchSkillsError?: { message: string } | null;
}

export default function SkillsRow({
  values,
  handleChange,
  setFieldValue,
  skillsList,
  fetchSkillsError,
}: Props) {
  return (
    <FieldArray name="skills">
      {({ remove, push }) => {
        const tryAddSkill = () => {
          const trimmed = values.newSkill.trim();
          if (!trimmed) return;

          const existsInForm = values.skills.some(
            (s: SkillData) =>
              s.skill.name.toLowerCase() === trimmed.toLowerCase()
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
          <div className={classes['skills']}>
            {values.skills.map((s: SkillData, index: number) => (
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
                placeholder="Add new skill"
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
                            .includes(values.newSkill.trim().toLowerCase()) &&
                          !values.skills.some(
                            (s: SkillData) => s.skill.id === item.id
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
            </div>

            <button
              type="button"
              className={classes['edit-skills-btn']}
              onClick={tryAddSkill}
            >
              <AnimatedIcon iconType={faPlus} />
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
}
