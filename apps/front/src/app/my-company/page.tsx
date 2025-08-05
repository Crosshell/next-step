'use client';

import CompanyProfileContainer from '@/components/CompanyProfileItems/CompanyProfileContainer';

import classes from './page.module.css';

import { companyData } from '@/lib/company-profile-data';

export default function CompanyProfilePage() {
  return (
    <div className="container">
      <CompanyProfileContainer isEditable companyData={companyData} />
    </div>
  );
}
