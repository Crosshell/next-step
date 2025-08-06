'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import ProfileForm from '@/components/ProfileItems/ProfileForm';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { getProfile } from '@/services/jobseekerService';

import { useModalStore } from '@/store/modalSlice';

import { ProfileData } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import ProfileContainer from '@/components/ProfileItems/ProfileContainer';

export default function ProfilePage() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const {
    data: profileData,
    isError,
    error,
  } = useQuery<ProfileData | null, ApiError>({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 1000,
    retry: false,
  });

  useEffect(() => {
    if (isError && error?.status === 401) {
      router.push('/sign-in');
    }
    if (isError && error?.status === 403) {
      openModal(<ProfileForm role="job-seeker" />, true);
    }
    if (profileData) {
      closeModal();
    }
  }, [isError, error, profileData, openModal, closeModal, router]);

  if (isError && error?.status !== 403)
    return (
      <div className={classes['profile-message-box']}>
        <MessageBox type="error">
          <p>Error loading profile: {error?.message || 'Unexpected error'}</p>
        </MessageBox>
      </div>
    );

  if (!profileData) return null;
  else console.log(profileData);

  return (
    <div className="container">
      <ProfileContainer isEditable profileData={profileData} />
    </div>
  );
}
