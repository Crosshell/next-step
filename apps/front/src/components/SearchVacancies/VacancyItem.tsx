import Link from 'next/link';
import Image from 'next/image';

import classes from './SearchVacancies.module.css';

export default function VacancyItem() {
  return (
    <div>
      <Link href="/vacancies" className={classes['vacancy-item']}>
        <div>
          <Image
            src="/images/suitcase.png"
            alt="stairs-image"
            width={70}
            height={70}
            priority
          />
          <div className={classes['short-info']}>
            <h4>Company Name</h4>
            <h3>Vacancy Name</h3>
          </div>
        </div>

        <p>Posted about millenium ago</p>
      </Link>
    </div>
  );
}
