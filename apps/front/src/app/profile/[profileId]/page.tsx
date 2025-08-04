'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import MessageBox from '@/components/MessageBox/MessageBox';
import ProfileContainer from '@/components/ProfileItems/ProfileContainer';

import classes from './page.module.css';

import { ProfileData } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import { getProfileById } from '@/services/jobseekerService';

export default function ProfilePage() {
  const params = useParams();
  const id = params.profileId as string;

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useQuery<ProfileData | null, ApiError>({
    queryKey: ['profile'],
    queryFn: () => getProfileById(id),
    staleTime: 1000,
    retry: false,
  });

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

  return (
    <div className="container">
      <ProfileContainer profileData={profileData} />
    </div>
  );
}
