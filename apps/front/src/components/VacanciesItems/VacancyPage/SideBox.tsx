'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import HoveredItem from '../../HoveredItem/HoveredItem';

import classes from './SideBox.module.css';

import { VacancySideBoxData } from '@/types/vacancy';
import { capitalize, toKebabCase } from '@/utils/convertData';
import { validateImageUrl } from '@/utils/validation';
import Cookies from 'js-cookie';

interface Props {
  data: VacancySideBoxData;
}

export default function SideBox({ data }: Props) {
  const [logoUrl, setLogoUrl] = useState('/images/suitcase.png');
  const [isLoaded, setIsLoaded] = useState(false);
  const companyId = Cookies.get('company-id');

  useEffect(() => {
    const companyLogo = data.companyLogo ?? '';
    setIsLoaded(false);

    validateImageUrl(companyLogo).then((isValid) => {
      if (isValid) {
        setLogoUrl(companyLogo);
      } else {
        setLogoUrl('/images/organization-dark.png');
      }
      setIsLoaded(true);
    });
  }, [data.companyLogo]);

  return (
    <motion.div
      className={classes['side-box']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={logoUrl}
        alt="stairs-image"
        width={100}
        height={100}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <h3>{data?.companyName}</h3>
      <h4 className={classes['site-link']}>
        <Link href={data?.companyUrl || '/'}>
          <HoveredItem>Visit Website</HoveredItem>
        </Link>
      </h4>
      <section>
        <h4>Employment Type:</h4>
        <p>
          {capitalize(
            data?.employmentType.map((v: string) => toKebabCase(v)).join(', ')
          )}
        </p>
      </section>
      <section>
        <h4>Work Format:</h4>
        <p>{capitalize(data?.workFormat.join(', '))}</p>
      </section>
      <section>
        <h4>Office Location:</h4>
        <p className={classes.office}>{data?.officeLocation}</p>
      </section>
      <section>
        <h4>Salary:</h4>
        <p>
          {data?.salaryMin} - {data.salaryMax} $
        </p>
      </section>
      {!companyId && (
        <button className={classes['apply-btn']}>
          <HoveredItem> Apply for a job</HoveredItem>
        </button>
      )}
      {companyId === data?.companyId && (
        <Link
          href={`/my-company/vacancies/edit-vacancy/${data.id}`}
          className={classes['edit-link']}
        >
          <HoveredItem>Edit vacancy</HoveredItem>
        </Link>
      )}
    </motion.div>
  );
}
