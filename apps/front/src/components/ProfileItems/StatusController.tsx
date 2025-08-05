'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from './Profile.module.css';
import { updatePersonalData } from '@/services/jobseekerService';

interface Props {
  isEditable: boolean;
  isTrue: boolean;
  type?: 'isOpen' | 'isVerified';
}

export default function OpenToWork({
  isEditable,
  isTrue,
  type = 'isOpen',
}: Props) {
  const [requestErrors, setRequestErrors] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { mutate: updateIsOpen, isPending } = useMutation({
    mutationFn: updatePersonalData,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestErrors([result.error]);
        return;
      }
      setRequestErrors([]);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const toggleIsOpen = () => {
    updateIsOpen({ isOpenToWork: !isTrue });
  };

  const isOpenVariants = ['Open to Work', 'Do not disturb'];
  const isVerifiedVariants = ['Is verified', 'Not Verified'];

  const variants =
    type === 'isOpen' ? [...isOpenVariants] : [...isVerifiedVariants];

  return (
    <>
      <button
        className={
          isTrue ? classes['open-to-work'] : classes['not-open-to-work']
        }
        disabled={!isEditable || isPending}
        onClick={toggleIsOpen}
        style={{ cursor: isEditable ? 'pointer' : 'default' }}
      >
        <AnimatedIcon scale={isEditable ? 1.1 : 1}>
          {isTrue ? variants[0] : variants[1]}
        </AnimatedIcon>
      </button>
      {requestErrors.length > 0 && (
        <div className={classes['request-error-container']}>
          {requestErrors.map((error) => (
            <MessageBox key={error}>{error}</MessageBox>
          ))}
        </div>
      )}
    </>
  );
}
