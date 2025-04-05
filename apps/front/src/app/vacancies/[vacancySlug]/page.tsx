import Image from 'next/image';
import Link from 'next/link';

import classes from './page.module.css';

import { vacanciesData } from '@/lib/test-data';
import { Vacancy } from '@/types/vacancy';

interface Props {
  params: {
    vacancySlug: string;
  };
}

const getVacancyById = (id: string): Vacancy | undefined => {
  return vacanciesData.find((vacancy) => vacancy.id === id);
};

export default async function VacancyPage({ params }: Props) {
  const { vacancySlug } = await params;

  const data = getVacancyById(vacancySlug);
  const date = new Date();
  const dateString = date.toLocaleDateString('en-GB');

  return (
    <div className="container">
      <div className={classes['vacancy-container']}>
        <div className={classes['main-info']}>
          <h2>Job Details</h2>
          <h1>{data?.title}</h1>
          <p className={classes['details']}>{data?.description}</p>
          <section>
            <h3>Experience</h3>
            <p>{data?.experience_required} years</p>
          </section>
          <section>
            <h3>Seniority</h3>
            <p>{data?.seniority_level}</p>{' '}
          </section>
          <div className={classes['date-views-row']}>
            <h4>
              Posted: <span>{dateString}</span>
            </h4>
            <h4>
              Views: <span>{data?.views}</span>
            </h4>
          </div>
          <button className={classes['apply-btn']}>Apply for a job</button>
        </div>
        <div className={classes['side-box']}>
          <Image
            src="/images/organization-dark.png"
            alt="stairs-image"
            width={100}
            height={100}
            priority
          />
          <h3>{data?.company_name}</h3>
          <h4 className={classes['site-link']}>
            <Link href={data?.company_site || '/'}>Visit Website</Link>
          </h4>
          <section>
            <h4>Employment Type:</h4>
            <p>{data?.employment_type}</p>
          </section>
          <section>
            <h4>Work Format:</h4>
            <p>{data?.work_format}</p>
          </section>
          <section>
            <h4>Office Location:</h4>
            <p>{data?.office_location}</p>
          </section>
          <button className={classes['apply-btn']}>Apply for a job</button>
        </div>
      </div>
    </div>
  );
}
