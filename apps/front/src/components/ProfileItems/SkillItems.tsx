import { useRef, useState } from 'react';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import {
  faPlus,
  faCheck,
  faXmark,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  skills: string[];
}

export default function SkillItems({ skills }: Props) {
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [userSkills, setUserSkills] = useState<string[]>(skills);
  const [tempSkills, setTempSkills] = useState<string[]>(skills);
  const [newSkill, setNewSkill] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleChangeSkills = () => {
    setIsChanging(true);
    setTempSkills(userSkills);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (tempSkills.includes(newSkill.trim())) return;
    setTempSkills((prev) => [...prev, newSkill.trim()]);
    setNewSkill('');
    setIsAdding(false);
  };

  const handleDelSkill = (skillToRemove: string) => {
    setTempSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = () => {
    setUserSkills(tempSkills);
    setIsChanging(false);
  };

  return (
    <>
      {!isChanging && (
        <div className={classes.skills}>
          {userSkills.map((skill) => {
            return <span key={skill}>{skill}</span>;
          })}
          <button
            className={classes['edit-skills-btn']}
            type="button"
            onClick={handleChangeSkills}
          >
            <AnimatedIcon iconType={faPlus} />
          </button>
        </div>
      )}
      {isChanging && (
        <form
          ref={formRef}
          className={classes.skills}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {tempSkills.map((skill) => (
            <div key={skill} className={classes['del-btn-box']}>
              <span>{skill}</span>
              <button
                className={classes['del-skill-btn']}
                type="button"
                onClick={() => handleDelSkill(skill)}
              >
                <AnimatedIcon iconType={faTrash} />
              </button>
            </div>
          ))}

          {isAdding && (
            <input
              type="text"
              className={classes['add-skill-input']}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter new skill"
            />
          )}

          <div className={classes['btn-container']}>
            <button
              className={classes['edit-skills-btn']}
              type="button"
              onClick={() => {
                if (isAdding) {
                  handleAddSkill();
                } else {
                  setIsAdding(true);
                }
              }}
            >
              <AnimatedIcon iconType={faPlus} />
            </button>
            <button
              className={classes['skills-cross-btn']}
              type="submit"
              onClick={() => setIsChanging(false)}
            >
              <AnimatedIcon iconType={faXmark} />
            </button>
            <button className={classes['skills-check-btn']} type="submit">
              <AnimatedIcon iconType={faCheck} />
            </button>{' '}
          </div>
        </form>
      )}
    </>
  );
}
