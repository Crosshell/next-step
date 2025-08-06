'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { ApiError } from '@/types/authForm';
import { getCompanyProfileById } from '@/services/companyProfileService';
import { CompanyProfileData } from '@/types/companyProfile';
import CompanyProfileContainer from '@/components/CompanyProfileItems/CompanyProfileContainer';

export default function CompanyPage() {
  const params = useParams();
  const id = params.companyId as string;

  const {
    data: companyData,
    isLoading,
    isError,
    error,
  } = useQuery<CompanyProfileData | null, ApiError>({
    queryKey: ['company-profile-' + id],
    queryFn: () => getCompanyProfileById(id),
    staleTime: 1000,
    retry: false,
  });

  if (isLoading)
    return (
      <div className={classes['profile-message-box']}>
        <MessageBox type="info">
          <p>Loading company...</p>
        </MessageBox>
      </div>
    );

  if (isError && error?.status !== 403)
    return (
      <div className={classes['profile-message-box']}>
        <MessageBox type="error">
          <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
        </MessageBox>
      </div>
    );

  if (!companyData) return null;

  return (
    <div className="container">
      <CompanyProfileContainer companyData={companyData} />
    </div>
  );
}
