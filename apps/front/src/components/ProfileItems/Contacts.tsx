'use client';

import { AnimatePresence } from 'framer-motion';

import ContactLink from './ContactLink';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import ContactsModal from './ContactsModal';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './Profile.module.css';

import { useModalStore } from '@/store/modalSlice';
import { ContactsData } from '@/types/profile';

interface Props {
  isEditable: boolean;
  data: ContactsData;
}

export default function Contacts({ isEditable, data }: Props) {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div className={classes.contacts}>
      <h3>Contacts:</h3>

      {data &&
        Object.entries(data).map(([key, value]) => {
          if (!value || value.trim().length === 0) return null;

          return <ContactLink key={key} type={key} url={value} />;
        })}

      {isEditable && (
        <button
          className={classes['edit-contacts-btn']}
          onClick={() =>
            openModal(
              <AnimatePresence>
                <ContactsModal data={data} />
              </AnimatePresence>
            )
          }
        >
          <AnimatedIcon iconType={faPlus} />
        </button>
      )}
    </div>
  );
}
