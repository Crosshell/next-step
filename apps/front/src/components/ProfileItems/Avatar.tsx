import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import HoveredItem from '@/components/HoveredItem/HoveredItem';
import AvatarModal from './AvatarModal';

import classes from './Profile.module.css';

import { useModalStore } from '@/store/modalSlice';
import { validateImageUrl } from '@/utils/validation';

interface Props {
  isEditable: boolean;
  data: string | null;
  type?: 'job-seeker' | 'company';
}

export default function Avatar({
  isEditable,
  data,
  type = 'job-seeker',
}: Props) {
  const openModal = useModalStore((state) => state.openModal);
  const fallbackImage =
    type === 'job-seeker'
      ? '/images/no-avatar.png'
      : '/images/company-no-logo.png';
  const [avatarUrl, setAvatarUrl] = useState(fallbackImage);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!data) {
      setAvatarUrl(fallbackImage);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    validateImageUrl(data).then((isValid) => {
      if (isValid) {
        setAvatarUrl(data);
      } else {
        setAvatarUrl(fallbackImage);
      }
      setIsLoaded(true);
    });
  }, [data, fallbackImage]);

  return (
    <button
      className={classes['avatar-btn']}
      type="submit"
      onClick={() =>
        openModal(
          <AnimatePresence>
            <AvatarModal url={data ?? ''} type={type} />
          </AnimatePresence>
        )
      }
      disabled={!isEditable}
    >
      <HoveredItem scale={isEditable ? 1.05 : 1}>
        <img
          src={avatarUrl}
          alt="avatar-image"
          width={250}
          height={250}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            cursor: isEditable ? 'pointer' : 'default',
          }}
          className={classes['avatar-img']}
        />
      </HoveredItem>
    </button>
  );
}
