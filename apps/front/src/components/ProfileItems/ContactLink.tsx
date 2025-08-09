'use client';

import { useState } from 'react';
import Link from 'next/link';

import AnimatedIcon from '../HoveredItem/HoveredItem';

import {
  faLinkedinIn,
  faGithub,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import {
  faContactBook,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import classes from './Profile.module.css';

interface Props {
  type: string;
  url: string;
}

export default function ContactLink({ type, url }: Props) {
  const [copied, setCopied] = useState(false);

  let icon = faContactBook;
  let isCopyable = false;

  switch (type.toLowerCase()) {
    case 'linkedinurl':
      icon = faLinkedinIn;
      break;
    case 'githuburl':
      icon = faGithub;
      break;
    case 'telegramurl':
      icon = faTelegram;
      break;
    case 'publicemail':
      icon = faEnvelope;
      isCopyable = true;
      break;
    case 'phonenumber':
      icon = faPhone;
      isCopyable = true;
      break;
    default:
      return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('Failed to copy');
    }
  };

  if (isCopyable) {
    return (
      <button
        type="button"
        className={classes['icon-link']}
        onClick={handleCopy}
        title={`Click to copy ${type}`}
      >
        <AnimatedIcon iconType={icon} scale={1.2} />
        {copied && <span className={classes['copied-tooltip']}>Copied!</span>}
      </button>
    );
  }

  return (
    <Link href={url} className={classes['icon-link']}>
      <AnimatedIcon iconType={icon} scale={1.2} />
    </Link>
  );
}
