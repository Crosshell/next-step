'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import CompanyProfileContainer from '@/components/CompanyProfileItems/CompanyProfileContainer';
import ProfileForm from '@/components/ProfileItems/ProfileForm';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { ApiError } from '@/types/authForm';
import { CompanyProfileData } from '@/types/companyProfile';
import { useModalStore } from '@/store/modalSlice';
import { getMyCompanyProfile } from '@/services/companyProfileService';
import Cookies from 'js-cookie';

export default function CompanyProfilePage() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const {
    data: companyData,
    isError,
    error,
  } = useQuery<CompanyProfileData | null, ApiError>({
    queryKey: ['company-profile'],
    queryFn: getMyCompanyProfile,
    staleTime: 1000,
    retry: false,
  });

  useEffect(() => {
    if (isError && error?.status === 401) {
      router.push('/sign-in');
    }
    if (isError && error?.status === 403) {
      openModal(<ProfileForm role="company" />, true);
    }
    if (companyData) {
      Cookies.set('role', 'COMPANY');
      Cookies.set('company-id', companyData.id);
      closeModal();
    }
  }, [isError, error, companyData, openModal, closeModal, router]);

  if (isError && error?.status !== 403)
    return (
      <div className={classes['profile-message-box']}>
        <MessageBox type="error">
          <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
        </MessageBox>
      </div>
    );

  if (!companyData) return null;
  else console.log(companyData);

  return (
    <div className="container">
      <CompanyProfileContainer isEditable companyData={companyData} />
    </div>
  );
}
