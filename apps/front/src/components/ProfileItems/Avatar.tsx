'use client';

import { useEffect, useState } from 'react';
import HoveredItem from '@/components/HoveredItem/HoveredItem';

import classes from './Profile.module.css';
import { useModalStore } from '@/store/modalSlice';
import { AnimatePresence } from 'framer-motion';
import AvatarModal from './AvatarModal';

interface Props {
  isEditable: boolean;
  data: string | null;
}

export default function Avatar({ isEditable, data }: Props) {
  const openModal = useModalStore((state) => state.openModal);
  const [avatarUrl, setAvatarUrl] = useState('/images/no-avatar.png');

  useEffect(() => {
    if (!data) return;

    const img = new Image();
    img.src = data;
    img.onload = () => setAvatarUrl(data);
    img.onerror = () => setAvatarUrl('/images/no-avatar.png');
  }, [data]);

  return (
    <button
      className={classes['avatar-btn']}
      type="submit"
      onClick={() =>
        openModal(
          <AnimatePresence>
            <AvatarModal url={data ?? ''} />
          </AnimatePresence>
        )
      }
      disabled={!isEditable}
    >
      <HoveredItem scale={1.05}>
        <img
          src={avatarUrl}
          alt="avatar-image"
          width={250}
          height={250}
          className={classes['avatar-img']}
        />
      </HoveredItem>
    </button>
  );
}
