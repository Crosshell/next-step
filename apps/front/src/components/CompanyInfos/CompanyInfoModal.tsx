'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import VacancyItem from './VacancyItem';
import { useModalStore } from '@/store/modalSlice';
import classes from './CompanyInfos.module.css';

export default function CompanyInfoModal() {
  const closeModal = useModalStore((state) => state.closeModal);

  const closeModalHandler = () => {
    closeModal();
  };

  return (
    <motion.div
      className={classes['modal-container']}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
    >
      <div className={classes['header-row']}>
        <h3>A company</h3>
        <Image
          src="/images/organization.png"
          alt="organization-logo"
          width={70}
          height={70}
          priority
        />
      </div>
      <p className={classes['company-details']}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
        ratione a sequi reprehenderit eligendi possimus, aspernatur deleniti
        minima blanditiis laborum, dolores illo temporibus deserunt! Nihil at
        cum qui deserunt! Officia.
      </p>
      <h4>Vacancies</h4>
      <ul className={classes['vacancies-list']}>
        <li>
          <VacancyItem />
        </li>
        <li>
          <VacancyItem />
        </li>
        <li>
          <VacancyItem />
        </li>
      </ul>
      <div className={classes['nav-row']}>
        <motion.button
          className={classes['close-btn']}
          onClick={closeModalHandler}
          whileHover={{ scale: 1.2 }}
        >
          Close
        </motion.button>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link href="/" className={classes['more-btn']}>
            More vacancies <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
