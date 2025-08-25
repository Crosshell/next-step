'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import classes from '../VacanciesItems/VacanciesItems.module.css';

import { JobSeekerItemData } from '@/types/jobSeekerSearch';
import { isoToDate } from '@/utils/convertData';
import { validateImageUrl } from '@/utils/validation';

interface Props {
  data: JobSeekerItemData;
}

export default function JobSeekerItem({ data }: Props) {
  const [logoUrl, setLogoUrl] = useState('/images/suitcase.png');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const companyLogo = data.avatarUrl ?? '';
    setIsLoaded(false);

    validateImageUrl(companyLogo).then((isValid) => {
      if (isValid) {
        setLogoUrl(companyLogo);
      } else {
        setLogoUrl('/images/company-no-logo.png');
      }
      setIsLoaded(true);
    });
  }, [data.avatarUrl]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={classes['vacancy-item-container']}
    >
      <Link href={`/profile/${data.id}`} className={classes['vacancy-item']}>
        <div>
          <img
            src={logoUrl}
            alt="company-logo"
            width={70}
            height={70}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
          <div className={classes['short-info']}>
            <h3>
              {data.firstName} {data.lastName}
            </h3>
            <h4>
              {data.dateOfBirth && data.dateOfBirth.trim().length > 0
                ? isoToDate(data.dateOfBirth)
                : 'No birth date'}
            </h4>
          </div>
        </div>

        <p>Joined: {isoToDate(data.createdAt)}</p>
      </Link>
    </motion.div>
  );
}
