'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import classes from '../VacanciesItems/VacanciesItems.module.css';

import { CompanyItemData } from '@/types/companiesSearch';
import { isoToDate } from '@/utils/convertData';
import { validateImageUrl } from '@/utils/validation';

interface Props {
  data: CompanyItemData;
}

export default function CompanyItem({ data }: Props) {
  const [logoUrl, setLogoUrl] = useState('/images/suitcase.png');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const companyLogo = data.logoUrl ?? '';
    setIsLoaded(false);

    validateImageUrl(companyLogo).then((isValid) => {
      if (isValid) {
        setLogoUrl(companyLogo);
      } else {
        setLogoUrl('/images/company-no-logo.png');
      }
      setIsLoaded(true);
    });
  }, [data.logoUrl]);

  console.log(data.name.trim().length > 0 ? data.name : 'No url');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={classes['vacancy-item-container']}
    >
      <Link href={`/company/${data.id}`} className={classes['vacancy-item']}>
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
            <h3>{data.name}</h3>
            <h4>{data.url.trim().length > 0 ? data.url : 'No url'}</h4>
          </div>
        </div>

        <p>Joined: {isoToDate(data.createdAt)}</p>
      </Link>
    </motion.div>
  );
}
