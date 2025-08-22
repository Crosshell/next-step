import { Field } from 'formik';
import HoveredItem from '../HoveredItem/HoveredItem';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './FormItems.module.css';

import { LanguageData } from '@/types/profile';
import { clientLanguageLevels, languageLevels } from '@/lib/profile-data';

interface Props {
  index: number;
  languagesList: LanguageData[];
  onRemove: () => void;
  type?: 'tagBox';
}

export default function LanguageRow({
  index,
  languagesList,
  onRemove,
  type,
}: Props) {
  return (
    <div
      className={
        type !== 'tagBox'
          ? classes['language-row']
          : classes['language-row-tag-box']
      }
    >
      <Field
        as="select"
        name={
          type !== 'tagBox'
            ? `languages[${index}].language.id`
            : `requiredLanguages[${index}].language.id`
        }
        className={classes['form-input']}
      >
        <option value="" disabled>
          Select language
        </option>
        {languagesList?.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </Field>

      <Field
        as="select"
        name={
          type !== 'tagBox'
            ? `languages[${index}].level`
            : `requiredLanguages[${index}].level`
        }
        className={classes['form-input']}
      >
        <option value="" disabled>
          Select level
        </option>
        {languageLevels.map((level, index) => (
          <option key={level} value={level}>
            {clientLanguageLevels[index]}
          </option>
        ))}
      </Field>

      <button
        className={classes['form-del-btn']}
        type="button"
        onClick={() => onRemove()}
      >
        <HoveredItem iconType={faTrash} />
      </button>
    </div>
  );
}
