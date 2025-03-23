'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

import classes from './page.module.css';

export default function Home() {
  const { scrollY } = useScroll();
  const opacityValue = useTransform(scrollY, [0, 350, 700], [1, 0.5, 0]);

  return (
    <div className="container">
      <motion.div
        className={classes['image-row']}
        style={{ opacity: opacityValue }}
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
            Unlock your potential and take your career to the next level—your
            future starts here!
          </h1>
        </motion.div>
      </motion.div>
      <div className={classes['subheader-box']}>
        <h2>Trusted by top companies, built for success.</h2>
        <h3>
          Partnering with industry leaders to drive innovation and growth.
        </h3>
      </div>
      <h1 style={{ fontSize: 100 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio modi
        porro iste voluptates nihil numquam rerum vel doloribus officiis velit
        accusamus, laboriosam vero mollitia, aliquam dolor aliquid debitis
        consequuntur commodi?
      </h1>
    </div>
  );
}
