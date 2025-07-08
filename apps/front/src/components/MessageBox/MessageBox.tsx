import classes from './MessageBox.module.css';
import { ReactNode } from 'react';

interface Props {
  type?: string;
  children: ReactNode;
}

export default function MessageBox({ type, children }: Props) {
  let color = '#f37199';
  if (type === 'info') color = '#ffffff';

  return (
    <div className={classes['error-box']} style={{ borderColor: color, color }}>
      {children}
    </div>
  );
}
