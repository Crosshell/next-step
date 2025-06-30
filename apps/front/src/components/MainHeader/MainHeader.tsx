'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {
  greenBorderBtnHover,
  whiteBorderBtnHover,
} from '@/animations/variants';
import classes from './MainHeader.module.css';

import { useAuthStore } from '@/store/authSlice';

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { isLogged, setIsLogged, setIsConfirmed, setRole } = useAuthStore();

  const handleLogOut = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    setIsLogged(false);
    setIsConfirmed(false);
    setRole(undefined);
    router.push('/');
  };

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
        {!isLogged && (
          <>
            <motion.div
              className={classes['no-border-btn']}
              whileHover={{
                scale: 1.1,
                borderColor: 'white',
              }}
            >
              <Link href="/sign-up">Sign Up</Link>
            </motion.div>
            <motion.div
              className={classes['border-btn']}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <Link href="/sign-in">Sign In</Link>
            </motion.div>
          </>
        )}
        {isLogged && (
          <>
            <motion.button
              className={classes['no-border-btn']}
              whileHover={{
                scale: 1.1,
                borderColor: 'white',
              }}
              onClick={handleLogOut}
            >
              Log Out
            </motion.button>
            <motion.div
              className={`${classes['border-btn']} ${pathname === '/profile' ? classes['active-link'] : ''} `}
              whileHover={
                pathname === '/profile'
                  ? greenBorderBtnHover
                  : whiteBorderBtnHover
              }
            >
              <Link href="/profile">Profile</Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
