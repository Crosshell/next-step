'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

import SkillItems from '@/components/ProfileItems/SkillItems';
import PersonalInfo from '@/components/ProfileItems/PersonalInfo';
import Contacts from '@/components/ProfileItems/Contacts';
import Bio from '@/components/ProfileItems/Bio';
import Languages from '@/components/ProfileItems/Languages';
import Certificates from '@/components/ProfileItems/Certificates';
import WorkExperience from '@/components/ProfileItems/WorkExperience';
import Education from '@/components/ProfileItems/Education';
import ProfileForm from '@/components/ProfileItems/ProfileForm';
import MessageBox from '@/components/MessageBox/MessageBox';

import classes from './page.module.css';

import { logoutUser } from '@/services/userService';
import { getProfile } from '@/services/jobseekerService';

import { userData } from '@/lib/profile-data';
import { useModalStore } from '@/store/modalSlice';
import { useAuthStore } from '@/store/authSlice';

import { ProfileData } from '@/types/profile';
import { ApiError } from '@/types/authForm';

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
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (isError && error?.status === 403) {
      openModal(<ProfileForm />, true);
    } else if (profileData) {
      closeModal();
    }
  }, [isError, error, profileData, openModal, closeModal]);

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
  let personalInfo;

  if (!profileData) return null;
  else {
    console.log(profileData);
    personalInfo = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      dateOfBirth: profileData.dateOfBirth,
      location: profileData.location,
    };
  }

  return (
    <div className="container">
      <div className={classes['profile-container']}>
        <h1 className={classes['page-header']}>Your Next Level Profile</h1>
        <div className={classes['main-info']}>
          <Image
            src="/images/no-avatar.png"
            alt="avatar-image"
            width={250}
            height={250}
            priority
          />
          <div className={classes['main-info-side']}>
            <div className={classes['skills-open-container']}>
              <SkillItems skills={userData.skills} />
              {profileData.isOpenToWork && (
                <div className={classes['open-to-work']}>
                  {profileData.isOpenToWork ? 'Open to Work' : ''}
                </div>
              )}
            </div>
            <PersonalInfo {...personalInfo} />
          </div>
        </div>
        <Contacts isEditable data={userData.contacts} />
        <Bio isEditable data={profileData.bio} />
        <WorkExperience isEditable data={userData.experience} />
        <Education isEditable data={userData.education} />
        <Certificates isEditable data={userData.certificates} />
        <Languages isEditable data={userData.languages} />

        <div className="row-end">
          <button className={classes['logout-btn']} onClick={handleLogoutAll}>
            Log out from all devices
          </button>
        </div>
      </div>
    </div>
  );
}
