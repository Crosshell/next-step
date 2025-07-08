import { ReactNode } from 'react';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

import classes from './Profile.module.css';

interface Props {
  children: ReactNode;
  title: string;
}

export default function InfoBox({ children, title }: Props) {
  return (
    <div className={classes['info-box']}>
      <div className="row-space-between">
        <h3>{title}</h3>
        <div className="row-align-center">
          <button className={classes['edit-info-btn']}>
            <AnimatedIcon iconType={faPencil} />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
