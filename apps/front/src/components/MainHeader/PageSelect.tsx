'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import classes from './MainHeader.module.css';
import Cookies from 'js-cookie';

export default function PageSelect() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const role = Cookies.get('role');

  const pages = [
    {
      label: 'Search for Vacancies',
      value: '/vacancies',
    },
    { label: 'Search for Companies', value: '/companies' },
  ];

  if (role === 'COMPANY') {
    pages.push({ label: 'Search for Job Seekers', value: '/job-seekers' });
  }

  const handleSelect = (page: { label: string; value: string }) => {
    setOpen(false);
    router.push(page.value);
  };

  return (
    <div className={classes['search-link-box']}>
      <button
        onClick={() => setOpen(!open)}
        className={classes['select-nav-btn']}
      >
        Make your first step →
      </button>

      {open && (
        <div
          className={classes['select-nav']}
          style={{ bottom: role !== 'COMPANY' ? '-110px' : '' }}
        >
          {pages.map((page) => (
            <div
              key={page.value}
              onClick={() => handleSelect(page)}
              className={classes['select-item']}
            >
              {page.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
