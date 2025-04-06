'use client';
import { motion } from 'framer-motion';

import classes from './SideBox.module.css';

export default function SideBoxButton() {
  return (
    <motion.button className={classes['apply-btn']} whileHover={{ scale: 1.1 }}>
      Apply for a job
    </motion.button>
  );
}
