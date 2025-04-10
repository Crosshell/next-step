'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import classes from './AnimatedIcon.module.css';

interface Props {
  iconType: IconDefinition;
  scale?: number;
}

export default function AnimatedIcon({ iconType, scale }: Props) {
  return (
    <motion.div
      className={classes['basic-icon']}
      whileHover={{ scale: scale ? scale : 1.1 }}
    >
      <FontAwesomeIcon icon={iconType} />
    </motion.div>
  );
}
