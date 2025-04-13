import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import HoveredItem from '../HoveredItem/HoveredItem';

import classes from './SignUpItems.module.css';

import { AppDispatch, RootState } from '@/store/store';
import { deleteRegFormData } from '@/store/slices/signUpSlice';

export default function ConfirmBoxItem() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const formData = useSelector((state: RootState) => state.signUp.regFormData);

  const stepUpHandler = () => {
    router.push('/sign-up?step=profile');
  };

  const deleteRegData = () => {
    dispatch(deleteRegFormData());
  };

  const onConfirmed = () => {
    console.log(formData);
    stepUpHandler();
    deleteRegData();
  };

  return (
    <motion.div
      className={classes['sign-up-form']}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Step 2: Confirmation</h3>
      <div className={classes['image-container']}>
        <Image
          src="/images/letter.png"
          alt="stairs-image"
          width={300}
          height={200}
          priority
        />
      </div>
      <h5>
        Please check your inbox and click the confirmation link to verify your
        email address.
      </h5>

      <div className="row-space-between">
        <div className="align-center">
          <HoveredItem scale={1.1}>
            <button className={classes['go-back-btn']}>Resend Email</button>
          </HoveredItem>
        </div>
        <HoveredItem scale={1.05}>
          <button className={classes['continue-btn']} onClick={onConfirmed}>
            Confirmed
          </button>
        </HoveredItem>
      </div>
    </motion.div>
  );
}
