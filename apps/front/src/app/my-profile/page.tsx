'use client';

import Link from 'next/link';
import Image from 'next/image';

import ContactLink from '@/components/ProfileItems/ContactLink';
import InfoBox from '@/components/ProfileItems/InfoBox';
import InfoItem from '@/components/ProfileItems/InfoItem';
import AnimatedIcon from '@/components/HoveredItem/HoveredItem';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import classes from './page.module.css';
import itemClasses from '../../components/ProfileItems/Profile.module.css';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/services/userService';
import { useAuthStore } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { setIsLogged, setIsConfirmed, setRole } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setIsLogged(false);
      setIsConfirmed(false);
      setRole(undefined);
      router.push('/sign-in');
    },
    onError: (err) => {
      console.error('Logout failed:', err);
    },
  });

  const handleLogoutAll = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to log out from all devices?'
    );
    if (!confirmLogout) return;

    logoutMutate();
  };

  return (
    <div className="container">
      <h1 className={classes['page-header']}>Your Next Level Profile</h1>
      <div className={classes['main-info']}>
        <Image
          src="/images/no-avatar.png"
          alt="stairs-image"
          width={250}
          height={250}
          priority
        />
        <div className={classes['main-info-side']}>
          <div className={classes.skills}>
            <span>Skill</span>
            <span>Skill</span>
            <span>Skill</span>
          </div>
          <div className={classes['personal-info']}>
            <h2>John Doe</h2>
            <p>20.02.2002</p>
            <p>Kyiv, Maidan Nezalezhnosti, 32</p>
          </div>
          <Link href="/profile" className={classes['edit-link']}>
            <AnimatedIcon iconType={faPencil} />
          </Link>
        </div>
      </div>
      <div className={classes.contacts}>
        <h3>Contacts:</h3>
        <ContactLink />
        <ContactLink />
        <ContactLink />
      </div>
      <InfoBox title="Your info">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt,
          non. Consectetur, laborum nesciunt facere atque hic vero. Impedit
          animi in, aperiam, asperiores odio quis excepturi ipsum quas
          voluptatum incidunt quos!
        </p>
      </InfoBox>
      <InfoBox title="Work Experience">
        <InfoItem title="Company Name" date="02.02.2002 - 03.03.2003">
          <p>
            Some information Some information Some information Some information
            Some information Some information Some information Some information
            Some information Some information Some information
          </p>
          <span className={itemClasses['is-current']}>is current</span>
        </InfoItem>
      </InfoBox>
      <InfoBox title="High Education">
        <InfoItem title="University Name" date="02.02.2002 - 03.03.2003">
          <p className="row-space-between">
            <span className="font-weight-500 font-size-1-5">
              Field of Study
            </span>
            <span className="font-weight-500 font-size-1-5">Degree</span>
          </p>
          <p>
            Some information Some information Some information Some information
            Some information Some information Some information Some information
            Some information Some information Some information
          </p>
        </InfoItem>
      </InfoBox>
      <InfoBox title="Certificates">
        <InfoItem title="Certificate Name" date="02.02.2002">
          <p>
            Url: <Link href="/">http://fsfdsfs/fsd/f/sd/fs/df/s/df</Link>
          </p>
        </InfoItem>
      </InfoBox>
      <InfoBox title="Languages">
        <p className="row-space-between">
          <span>English</span>
          <span>Upper-Intermediate (B2)</span>
        </p>
        <p className="row-space-between">
          <span>Spanish</span>
          <span>Upper-Intermediate (B2)</span>
        </p>
      </InfoBox>
      <div className="row-end">
        <button className={classes['logout-btn']} onClick={handleLogoutAll}>
          Log out from all devices
        </button>
      </div>
    </div>
  );
}
