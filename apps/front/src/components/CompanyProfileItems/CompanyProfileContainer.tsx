import { CompanyProfileData } from '@/types/companyProfile';

import OpenToWork from '../ProfileItems/StatusController';
import Avatar from '../ProfileItems/Avatar';

import classes from './CompanyProfile.module.css';
import profileClasses from '../ProfileItems/Profile.module.css';
import CompanyMainInfo from './CompanyMainInfo';
import Bio from '../ProfileItems/Description';
import BottomRow from '../ProfileItems/BottomRow';

interface Props {
  isEditable?: boolean;
  companyData: CompanyProfileData;
}

export default function CompanyProfileContainer({
  isEditable = false,
  companyData,
}: Props) {
  console.log(companyData);

  const mainInfoData = {
    name: companyData.name,
    url: companyData.url,
  };

  return (
    <div className={profileClasses['profile-container']}>
      {isEditable && (
        <h1 className={profileClasses['page-header']}>Your Amazing Company</h1>
      )}
      <div className={profileClasses['main-info']}>
        <Avatar
          key={`avatar-${companyData.id}`}
          isEditable={isEditable}
          data={companyData.logoUrl}
        />
        <div className="align-center">
          <div className={classes['main-info-side']}>
            <CompanyMainInfo isEditable={isEditable} data={mainInfoData} />
            <div className={profileClasses['skills-open-container']}>
              <OpenToWork
                isEditable={isEditable}
                isTrue={companyData.isVerified}
                type="isVerified"
              />
            </div>
          </div>
        </div>
      </div>
      <Bio
        isEditable={isEditable}
        data={companyData.description}
        title="Description"
      />
      <BottomRow isEditable={isEditable} data={companyData.createdAt} />
    </div>
  );
}
