'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

import ProfileForm from '@/components/ProfileItems/ProfileForm';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { logoutUser } from '@/services/userService';
import { getProfile } from '@/services/jobseekerService';

import { useModalStore } from '@/store/modalSlice';
import { useAuthStore } from '@/store/authSlice';

import { ProfileData } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import ProfileContainer from '@/components/ProfileItems/ProfileContainer';

export default function ProfilePage() {
  const router = useRouter();
  const { setIsLogged, setIsConfirmed, setRole } = useAuthStore();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const {
    data: profileData,
    isLoading,
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
      openModal(<ProfileForm />, true);
    }
    if (profileData) {
      closeModal();
    }
  }, [isError, error, profileData, openModal, closeModal, router]);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push('/sign-in');
      setIsLogged(false);
      setIsConfirmed(false);
      setRole(undefined);
    },
    onError: (err) => {
      console.error('Logout failed:', err);
    },
  });

  const handleLogoutAll = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to log out from all devices?'
    );
    if (!confirmLogout) return;

    logoutMutate();
  };

  if (isLoading)
    return (
      <div className={classes['profile-message-box']}>
        <MessageBox type="info">
          <p>Loading profile...</p>
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

  if (!profileData) return null;
  else console.log(profileData);

  return (
    <div className="container">
      <ProfileContainer
        isEditable
        profileData={profileData}
        logoutFn={handleLogoutAll}
      />
    </div>
  );
}
