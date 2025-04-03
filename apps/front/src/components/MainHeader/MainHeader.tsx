'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import classes from './MainHeader.module.css';

export default function MainHeader() {
  const pathname = usePathname();
  
  return (
    <div className={classes['header-box']}>
      <div className={classes['main-nav']}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link className={classes['home-link']} href="/">
            <span>Next Step</span>
            <Image
              src="/icons/stairs.png"
              alt="stairs-image"
              width={50}
              height={50}
              priority
            />
          </Link>
        </motion.div>

        <motion.div
          className={classes['search-link-box']}
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/vacancies">
            {pathname === '/vacancies' ? (
              <span>You&apos;re making your first step!</span>
            ) : (
              <>
                <span>Make your first step</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </Link>
        </motion.div>
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
