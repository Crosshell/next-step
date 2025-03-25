'use client';

import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

import CompanyInfos from '@/components/CompanyInfos/CompanyInfos';

import classes from './page.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CompanyInfoModal from '@/components/CompanyInfos/CompanyInfoModal';

export default function Home() {
  const isModal = useSelector((state: RootState) => state.modal.isOpen);

  const { scrollY } = useScroll();
  const yValue = useTransform(scrollY, [0, 300, 600], [0, -50, -100]);
  const opacityValue = useTransform(scrollY, [0, 350, 700], [1, 0.5, 0]);

  return (
    <>
      <AnimatePresence>{isModal && <CompanyInfoModal />}</AnimatePresence>
      <div className="container">
        <motion.div
          className={classes['image-row']}
          style={{
            opacity: isModal ? 1 : opacityValue,
            y: isModal ? 0 : yValue,
          }}
        >
          <motion.div
            className={classes['image-box']}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/people-on-stairs.png"
              alt="people-on-stairs"
              height={300}
              width={300}
            />
          </motion.div>
          <motion.div
            className={classes['image-heading-box']}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              Unlock your potential and take your career to the next level —
              your future starts here!
            </h1>
          </motion.div>
        </motion.div>
        <div className={classes['subheader-box']}>
          <h2>Trusted by top companies, built for success.</h2>
          <h3>
            Partnering with industry leaders to drive innovation and growth.
          </h3>
        </div>
        <CompanyInfos />
      </div>
    </>
  );
}
