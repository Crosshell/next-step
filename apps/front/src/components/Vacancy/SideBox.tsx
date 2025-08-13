'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import SideBoxButton from './SideBoxButton';

import classes from './SideBox.module.css';

import { VacancySideBoxData } from '@/types/vacancy';

interface Props {
  data: VacancySideBoxData;
}

export default function SideBox({ data }: Props) {
  return (
    <motion.div
      className={classes['side-box']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="/images/organization-dark.png"
        alt="stairs-image"
        width={100}
        height={100}
        priority
      />
      <h3>{data?.companyName}</h3>
      <h4 className={classes['site-link']}>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link href={data?.companyUrl || '/'}>Visit Website</Link>
        </motion.div>
      </h4>
      <section>
        <h4>Employment Type:</h4>
        <p>{data?.employmentType}</p>
      </section>
      <section>
        <h4>Work Format:</h4>
        <p>{data?.workFormat}</p>
      </section>
      <section>
        <h4>Office Location:</h4>
        <p>{data?.officeLocation}</p>
      </section>
      <SideBoxButton />
    </motion.div>
  );
}
