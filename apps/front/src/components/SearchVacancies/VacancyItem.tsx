'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import classes from './SearchVacancies.module.css';

import { VacancyData } from '@/types/vacancies';

interface Props {
  data: VacancyData;
}

export default function VacancyItem({ data }: Props) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Link href={`/vacancies/${data.id}`} className={classes['vacancy-item']}>
        <div>
          <Image
            src="/images/suitcase.png"
            alt="stairs-image"
            width={70}
            height={70}
            priority
          />
          <div className={classes['short-info']}>
            <h4>{data.title}</h4>
            <h3>{data.company.name}</h3>
          </div>
        </div>

        <p>Posted about millenium ago</p>
      </Link>
    </motion.div>
  );
}
