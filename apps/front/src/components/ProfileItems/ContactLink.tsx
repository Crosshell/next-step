'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Profile.module.css';

export default function ContactLink() {
  return (
    <Link href="/">
      <motion.div
        className={classes['contact-link']}
        whileHover={{ scale: 1.1 }}
      >
        <FontAwesomeIcon icon={faFacebookF} />
      </motion.div>
    </Link>
  );
}
