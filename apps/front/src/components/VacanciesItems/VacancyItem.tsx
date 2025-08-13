'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import classes from './VacanciesItems.module.css';

import { VacancyItemData } from '@/types/vacancies';
import { isoToDate } from '@/utils/convertData';
import { validateImageUrl } from '@/utils/validation';

interface Props {
  data: VacancyItemData;
}

export default function VacancyItem({ data }: Props) {
  const [logoUrl, setLogoUrl] = useState('/images/suitcase.png');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const companyLogo = data.companyLogo ?? '';
    setIsLoaded(false);

    validateImageUrl(companyLogo).then((isValid) => {
      if (isValid) {
        setLogoUrl(companyLogo);
      } else {
        setLogoUrl('/images/suitcase.png');
      }
      setIsLoaded(true);
    });
  }, [data.companyLogo]);

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link href={`/vacancies/${data.id}`} className={classes['vacancy-item']}>
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
            <h4>{data.title}</h4>
            <h3>{data.companyName}</h3>
          </div>
        </div>

        <p>Posted: {isoToDate(data.createdAt)}</p>
      </Link>
    </motion.div>
  );
}
