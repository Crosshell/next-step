'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useModalStore } from '@/store/modalSlice';
import classes from './CompanyInfos.module.css';

export default function CompanyInfoBox() {
  const isModalOpen = useModalStore((state) => state.isOpen);
  const openModal = useModalStore((state) => state.openModal);

  const [renderKey, setRenderKey] = useState<number>(0);

  const handleClick = () => {
    openModal();
    setRenderKey((prev) => prev + 1);
  };

  return (
    <motion.div
      key={renderKey}
      className={classes['company-info-container']}
      onClick={handleClick}
      whileHover={{ scale: isModalOpen ? 1 : 1.1 }}
    >
      <div className={classes['header-row']}>
        <h3>A company</h3>
        <Image
          src="/images/organization.png"
          alt="organization-logo"
          width={50}
          height={50}
          priority
        />
      </div>
      <p className={classes['company-details']}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
        ratione a sequi reprehenderit eligendi possimus, aspernatur deleniti
        minima blanditiis laborum, dolores illo temporibus deserunt! Nihil at
        cum qui deserunt! Officia.
      </p>
    </motion.div>
  );
}
