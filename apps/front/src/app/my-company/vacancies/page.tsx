'use client';

import { useQuery } from '@tanstack/react-query';
import classes from './page.module.css';
import { ApiError } from '@/types/authForm';
import { getMyVacancies } from '@/services/vacanciesService';
import { VacancyData } from '@/types/vacancies';
import VacancyItem from '@/components/VacanciesItems/VacancyItem';
import MessageBox from '@/components/MessageBox/MessageBox';
import Link from 'next/link';
import HoveredItem from '@/components/HoveredItem/HoveredItem';

export default function CompanyVacancies() {
  const {
    data: myVacancies,
    isPending,
    error,
    isError,
  } = useQuery<VacancyData[] | null, ApiError>({
    queryKey: ['company-profile'],
    queryFn: getMyVacancies,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  if (isError)
    return (
      <MessageBox type="error">
        <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
      </MessageBox>
    );

  if (isPending)
    return (
      <MessageBox>
        <p>Loading profile, wait a second... </p>
      </MessageBox>
    );

  return (
    <div className="container">
      <div className={classes['page-container']}>
        <h1 className={classes['page-header']}>
          Your Company&apos;s Vacancies
        </h1>
        <div className={classes['vacancies-container']}>
          <div className={classes['add-vacancy-btn-container']}>
            <Link
              href="/my-company/vacancies/new-vacancy"
              className={classes['add-vacancy-btn']}
            >
              <HoveredItem>Add Vacancy +</HoveredItem>
            </Link>
          </div>
          {myVacancies && Array.isArray(myVacancies) ? (
            myVacancies.map((vacancyData) => (
              <VacancyItem
                key={vacancyData.id}
                data={{
                  id: vacancyData.id,
                  title: vacancyData.title,
                  companyName: vacancyData.company.name,
                  companyLogo: vacancyData.company.logoUrl,
                  createdAt: vacancyData.createdAt,
                }}
              />
            ))
          ) : (
            <p>No vacancies found.</p>
          )}
          {/* <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error
            facilis dolor ad rem voluptatem ratione voluptatum asperiores,
            tempora earum, deserunt, suscipit omnis in laudantium dicta neque
            dolorum! Consequuntur, obcaecati cupiditate? Saepe obcaecati,
            debitis vero quibusdam beatae eum modi dolor delectus quaerat enim
            corrupti corporis laboriosam sit rem illum veniam illo optio?
            Consectetur dolorem fugit esse cupiditate illum magnam debitis quas.
            A, harum! Porro dolor illum accusamus maiores eos distinctio
            molestias inventore minima placeat veritatis? Perspiciatis
            distinctio reiciendis, molestiae nihil laboriosam commodi fugiat
            eveniet accusamus saepe temporibus excepturi inventore omnis
            ducimus. Quasi, earum ratione dolore corporis maxime repellendus
            modi optio officiis illo quae alias aut sequi neque, aliquid itaque
            corrupti reiciendis, est rerum voluptate facilis. Libero quia
            repudiandae natus optio debitis? Incidunt id quis cum odio corrupti
            voluptate debitis iure temporibus velit optio, expedita consequatur
            laborum? Voluptas, perferendis libero est, nobis laudantium dolore
            impedit repellendus ullam laborum obcaecati optio deleniti
            temporibus? Quibusdam laborum odit assumenda repudiandae.
            Accusantium praesentium rem dignissimos ea ipsa blanditiis eos,
            laudantium minus soluta vitae nisi, delectus nemo recusandae
            provident. Earum ratione dignissimos laudantium voluptatum
            consequuntur itaque voluptatem? Consequuntur dignissimos alias dicta
            consequatur optio ea aliquam sapiente velit rem, quo fugiat
            accusantium iusto debitis tempora rerum accusamus vitae commodi
            beatae! Quas magni ea id, blanditiis sed itaque reiciendis. Ipsum
            placeat obcaecati repellat nemo! Officiis quasi soluta similique,
            vitae dolorum aut nihil maiores id repellat. Inventore eius natus,
            earum quaerat quidem quasi corporis. Veritatis natus distinctio
            minima obcaecati qui?
          </p> */}
        </div>
      </div>
    </div>
  );
}
