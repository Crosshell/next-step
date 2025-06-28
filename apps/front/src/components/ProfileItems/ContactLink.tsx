'use client';
import Link from 'next/link';

import AnimatedIcon from '../HoveredItem/HoveredItem';

import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import classes from './Profile.module.css';

export default function ContactLink() {
  return (
    <Link href="/" className={classes['icon-link']}>
      <AnimatedIcon iconType={faFacebookF} scale={1.2} />
    </Link>
  );
}
