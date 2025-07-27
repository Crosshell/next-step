'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import InfoBox from '@/components/ProfileItems/InfoBox';
import InfoItem from '@/components/ProfileItems/InfoItem';
import SkillItems from '@/components/ProfileItems/SkillItems';
import PersonalInfo from '@/components/ProfileItems/PersonalInfo';
import Contacts from '@/components/ProfileItems/Contacts';

import classes from './page.module.css';
import itemClasses from '../../components/ProfileItems/Profile.module.css';

import { useAuthStore } from '@/store/authSlice';
import { logoutUser } from '@/services/userService';

import {
  bioData,
  certificatesData,
  personalInfo,
  skills,
  userLanguages,
} from '@/lib/profile-test-data';
import Bio from '@/components/ProfileItems/Bio';
import Languages from '@/components/ProfileItems/Languages';
import Certificates from '@/components/ProfileItems/Certificates';

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
        <InfoBox title="Work Experience" isEditable>
          <InfoItem title="Company Name" date="02.02.2002 - 03.03.2003">
            <p>
              Some information Some information Some information Some
              information Some information Some information Some information
              Some information Some information Some information Some
              information
            </p>
            <span className={itemClasses['is-current']}>is current</span>
          </InfoItem>
        </InfoBox>
        <InfoBox title="High Education" isEditable>
          <InfoItem title="University Name" date="02.02.2002 - 03.03.2003">
            <p className="row-space-between">
              <span className="font-weight-500 font-size-1-5">
                Field of Study
              </span>
              <span className="font-weight-500 font-size-1-5">Degree</span>
            </p>
            <p>
              Some information Some information Some information Some
              information Some information Some information Some information
              Some information Some information Some information Some
              information
            </p>
          </InfoItem>
        </InfoBox>
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
