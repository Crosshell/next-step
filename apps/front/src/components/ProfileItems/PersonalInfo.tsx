import { useRef, useState } from 'react';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import { faPencil, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

import { PersonalData } from '@/types/profile';

export default function PersonalInfo({
  name,
  birthdate,
  address,
}: PersonalData) {
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChangeInfo = () => {
    setIsChanging(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      const form = formRef.current;
      const formData = new FormData(form);

      const updatedName = formData.get('name') as string;
      const updatedBirthdate = formData.get('birthdate') as string;
      const updatedAddress = formData.get('address') as string;

      console.log('Updated:', updatedName, updatedBirthdate, updatedAddress);

      setIsChanging(false);
    }
  };

  return (
    <>
      {!isChanging ? (
        <>
          <div className={classes['personal-info']}>
            <h2>{name}</h2>
            <p>{birthdate}</p>
            <p>{address}</p>
          </div>
          <button
            className={classes['edit-personal-info-btn']}
            onClick={handleChangeInfo}
          >
            <AnimatedIcon iconType={faPencil} />
          </button>
        </>
      ) : (
        <form
          ref={formRef}
          className={classes['info-form']}
          onSubmit={handleSubmit}
        >
          <div className={classes['personal-info']}>
            <input
              className={classes['name-input']}
              name="name"
              defaultValue={name}
            />
            <input name="birthdate" defaultValue={birthdate} />
            <input name="address" defaultValue={address} />
          </div>
          <div className={classes['personal-info-btn-container']}>
            <button
              className={classes['personal-info-btn-cross']}
              onClick={handleChangeInfo}
              type="submit"
            >
              <AnimatedIcon iconType={faXmark} />
            </button>
            <button
              className={classes['personal-info-btn']}
              onClick={handleChangeInfo}
              type="submit"
            >
              <AnimatedIcon iconType={faCheck} />
            </button>
          </div>
        </form>
      )}
    </>
  );
}
