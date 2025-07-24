'use client';
import Link from 'next/link';

import AnimatedIcon from '../HoveredItem/HoveredItem';

import {
  faFacebookF,
  faLinkedinIn,
  faGithub,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import { faContactBook, faCode } from '@fortawesome/free-solid-svg-icons';

import classes from './Profile.module.css';

interface Props {
  type: string;
  url: string;
}

export default function ContactLink({ type, url }: Props) {
  let icon = faContactBook;
  switch (type.toLowerCase()) {
    case 'facebookurl':
      icon = faFacebookF;
      break;
    case 'linkedinurl':
      icon = faLinkedinIn;
      break;
    case 'githuburl':
      icon = faGithub;
      break;
    case 'telegramurl':
      icon = faTelegram;
      break;
    case 'codewarsurl':
      icon = faCode;
      break;
    default:
      return null;
  }

  return (
    <Link href={url} className={classes['icon-link']}>
      <AnimatedIcon iconType={icon} scale={1.2} />
    </Link>
  );
}
