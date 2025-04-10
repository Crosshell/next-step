import { ReactNode } from 'react';

import classes from './Profile.module.css';

interface Props {
  children: ReactNode;
  title: string;
  date?: string;
}

export default function InfoItem({ children, title, date }: Props) {
  return (
    <div className={classes['info-item']}>
      <div className={classes['item-header-row']}>
        <div className="row-space-between">
          <h4>{title}</h4>
          {date && (
            <div className="align-center">
              <span className={classes.date}>{date}</span>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
