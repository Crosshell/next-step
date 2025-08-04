'use client';

import { useModalStore } from '@/store/modalSlice';
import classes from './Modal.module.css';

export default function Modal() {
  const { isOpen, content, closeModal, isAbsolute } = useModalStore();

  if (!isOpen || !content) return null;

  const handleBackdropClick = () => {
    if (!isAbsolute) closeModal();
  };

  return (
    <div className={classes['modal-backdrop']} onClick={handleBackdropClick}>
      <div
        className={classes['modal-box']}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}
