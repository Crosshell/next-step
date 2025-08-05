import Avatar from '@/components/ProfileItems/Avatar';
import OpenToWork from '@/components/ProfileItems/StatusController';
import Skills from '@/components/ProfileItems/Skills';
import PersonalInfo from '@/components/ProfileItems/PersonalInfo';
import Contacts from '@/components/ProfileItems/Contacts';
import Bio from '@/components/ProfileItems/Description';
import Languages from '@/components/ProfileItems/Languages';
import Certificates from '@/components/ProfileItems/Certificates';
import WorkExperience from '@/components/ProfileItems/WorkExperience';
import Education from '@/components/ProfileItems/Education';

import classes from './Profile.module.css';
import { ProfileData } from '@/types/profile';
import { userData } from '@/lib/profile-data';
import BottomRow from './BottomRow';

interface Props {
  isEditable?: boolean;
  profileData: ProfileData;
}

export default function ProfileContainer({
  isEditable = false,
  profileData,
}: Props) {
  const personalInfo = {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    dateOfBirth: profileData.dateOfBirth,
    location: profileData.location,
  };

  return (
    <div className={classes['profile-container']}>
      <h1 className={classes['page-header']}>Your Next Level Profile</h1>
      <div className={classes['main-info']}>
        <Avatar
          key={`avatar-${profileData.id}`}
          isEditable={isEditable}
          data={profileData.avatarUrl}
        />
        <div className={classes['main-info-side']}>
          <div className={classes['skills-open-container']}>
            <Skills isEditable={isEditable} skills={profileData.skills} />
            <OpenToWork
              isEditable={isEditable}
              isTrue={profileData.isOpenToWork}
            />
          </div>
          <PersonalInfo isEditable={isEditable} data={personalInfo} />
        </div>
      </div>
      <Contacts isEditable={isEditable} data={profileData.contacts} />
      <Bio isEditable={isEditable} data={profileData.bio} />
      <WorkExperience isEditable={isEditable} data={userData.experience} />
      <Education isEditable={isEditable} data={userData.education} />
      <Certificates isEditable={isEditable} data={userData.certificates} />
      <Languages isEditable={isEditable} data={profileData.languages} />
      <BottomRow isEditable={isEditable} data={profileData.createdAt} />
    </div>
  );
}
