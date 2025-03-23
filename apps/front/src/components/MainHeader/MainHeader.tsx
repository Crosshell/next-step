'use client';
import Link from 'next/link';
import classes from './MainHeader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MainHeader() {
  return (
    <div className={classes['header-box']}>
      <div className={classes['main-nav']}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link className={classes['home-link']} href="/">
            <span>Next Step</span>
            <Image
              src="/images/stairs.png"
              alt="stairs-image"
              width={50}
              height={50}
              priority
            />
          </Link>
        </motion.div>

        <div className={classes['search-link-box']}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/">
              <span>Make your first step</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </motion.div>
        </div>
      </div>
      <div className={classes['auth-nav']}>
        <motion.div
          className={classes['sign-up-btn']}
          whileHover={{
            scale: 1.1,
            borderColor: 'white',
          }}
        >
          <Link href="/">Sign Up</Link>
        </motion.div>
        <motion.div
          className={classes['log-in-btn']}
          whileHover={{
            scale: 1.1,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <Link href="/">Log In</Link>
        </motion.div>
      </div>
    </div>
  );
}
