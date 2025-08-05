import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import classes from './CompanyProfile.module.css';

import { MainInfoData } from '@/types/companyProfile';
import { useState } from 'react';

interface Props {
  isEditable?: boolean;
  data: MainInfoData;
}

export default function CompanyMainInfo({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  return (
    <>
      <div className={classes['main-info-data']}>
        <h2>{data.name}</h2>
        <p>
          {isEditable ? 'Your w' : 'W'}ebsite: {data.url}
        </p>

        {isEditable && (
          <button
            className={classes['edit-main-info-btn']}
            onClick={() => setIsChanging(true)}
          >
            <AnimatedIcon iconType={faPencil} />
          </button>
        )}
      </div>
    </>
  );
}
