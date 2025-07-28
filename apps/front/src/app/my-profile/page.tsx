'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import SkillItems from '@/components/ProfileItems/SkillItems';
import PersonalInfo from '@/components/ProfileItems/PersonalInfo';
import Contacts from '@/components/ProfileItems/Contacts';
import Bio from '@/components/ProfileItems/Bio';
import Languages from '@/components/ProfileItems/Languages';
import Certificates from '@/components/ProfileItems/Certificates';
import WorkExperience from '@/components/ProfileItems/WorkExperience';
import Education from '@/components/ProfileItems/Education';

import classes from './page.module.css';

import { useAuthStore } from '@/store/authSlice';
import { logoutUser } from '@/services/userService';

import {
  bioData,
  certificatesData,
  educationData,
  experienceData,
  personalInfo,
  skills,
  userLanguages,
} from '@/lib/profile-test-data';

export default function ProfilePage() {
  const router = useRouter();
  const { setIsLogged, setIsConfirmed, setRole } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setIsLogged(false);
      setIsConfirmed(false);
      setRole(undefined);
      router.push('/sign-in');
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
            <SkillItems skills={skills} />
            <PersonalInfo {...personalInfo} />
          </div>
        </div>
        <Contacts />
        <Bio isEditable bio={bioData.bio} />
        <WorkExperience isEditable data={experienceData} />

        <Education isEditable data={educationData} />
        <Certificates isEditable data={certificatesData} />

        <Languages isEditable data={userLanguages} />

        <div className="row-end">
          <button className={classes['logout-btn']} onClick={handleLogoutAll}>
            Log out from all devices
          </button>
        </div>
      </div>
    </div>
  );
}
