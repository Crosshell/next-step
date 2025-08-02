'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import classes from './Profile.module.css';
import { updatePersonalData } from '@/services/jobseekerService';

interface Props {
  isEditable: boolean;
  isOpenToWork: boolean;
}

export default function OpenToWork({ isEditable, isOpenToWork }: Props) {
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
    updateIsOpen({ isOpenToWork: !isOpenToWork });
  };

  return (
    <>
      <button
        className={
          isOpenToWork ? classes['open-to-work'] : classes['not-open-to-work']
        }
        disabled={!isEditable && isPending}
        onClick={toggleIsOpen}
      >
        <AnimatedIcon>
          {isOpenToWork ? 'Open to Work' : 'Do not disturb'}
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
