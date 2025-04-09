import { ReactNode } from 'react';
import classes from './Profile.module.css';

interface Props {
  children: ReactNode;
  title: string;
}

export default function InfoBox({ children, title }: Props) {
  return (
    <div className={classes['info-box']}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
