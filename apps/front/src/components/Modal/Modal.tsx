'use client';

import { useModalStore } from '@/store/modalSlice';
import classes from './Modal.module.css';

export default function Modal() {
  const { isOpen, content, closeModal } = useModalStore();

  if (!isOpen || !content) return null;

  return (
    <div className={classes['modal-backdrop']} onClick={closeModal}>
      <div
        className={classes['modal-box']}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}
