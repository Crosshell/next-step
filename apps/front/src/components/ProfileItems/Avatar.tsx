import { useEffect, useState } from 'react';
import HoveredItem from '@/components/HoveredItem/HoveredItem';
import classes from './Profile.module.css';
import { useModalStore } from '@/store/modalSlice';
import { AnimatePresence } from 'framer-motion';
import AvatarModal from './AvatarModal';

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
  const [avatarUrl, setAvatarUrl] = useState('/images/no-avatar.png');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!data) {
      setAvatarUrl(
        type === 'job-seeker'
          ? '/images/no-avatar.png'
          : '/images/company-no-logo.png'
      );
      setIsLoaded(true);
      return;
    }
    setIsLoaded(false);

    const img = new Image();
    img.src = data;
    img.onload = () => {
      setAvatarUrl(data);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setAvatarUrl('/images/no-avatar.png');
      setIsLoaded(true);
    };
  }, [data]);

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
