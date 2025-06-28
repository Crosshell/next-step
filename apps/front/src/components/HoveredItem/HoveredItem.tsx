'use client';
import { ReactNode } from 'react';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import classes from './HoveredItem.module.css';

interface Props {
  children?: ReactNode;
  iconType?: IconDefinition;
  scale?: number;
}

export default function HoveredItem({ children, iconType, scale }: Props) {
  return (
    <motion.div
      className={classes['basic-icon']}
      whileHover={{ scale: scale ? scale : 1.1 }}
    >
      {iconType && <FontAwesomeIcon icon={iconType} />}
      {children && children}
    </motion.div>
  );
}
