'use client';

import { AnimatePresence } from 'framer-motion';

import ContactLink from './ContactLink';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import ContactsModal from './ContactsModal';

import classes from './Profile.module.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useModalStore } from '@/store/modalSlice';
import { contactData } from '@/lib/profile-test-data';

export default function Contacts() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div className={classes.contacts}>
      <h3>Contacts:</h3>

      {contactData &&
        Object.entries(contactData).map(([key, value]) => {
          if (!value || value.trim().length === 0) return null;

          return <ContactLink key={key} type={key} url={value} />;
        })}

      <button
        className={classes['edit-contacts-btn']}
        onClick={() =>
          openModal(
            <AnimatePresence>
              <ContactsModal data={contactData} />
            </AnimatePresence>
          )
        }
      >
        <AnimatedIcon iconType={faPlus} />
      </button>
    </div>
  );
}
