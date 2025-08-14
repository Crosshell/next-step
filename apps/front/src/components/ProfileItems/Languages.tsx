import { useState } from 'react';

import InfoBox from './InfoBox';

import { UserLanguageData } from '@/types/profile';
import { updateUserLanguages } from '@/services/jobseekerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RequestError from '../RequestErrors/RequestErrors';
import { toClientLangLevel } from '@/utils/convertData';
import LanguagesForm from '../FormItems/LanguagesForm';

interface Props {
  isEditable: boolean;
  data: UserLanguageData[];
}

export default function Languages({ isEditable, data }: Props) {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: updateLanguages,
    isPending,
    error: updateLangError,
  } = useMutation({
    mutationFn: updateUserLanguages,
    onSuccess: async (result) => {
      if (result.status === 'error') return;
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditMode(false);
    },
  });

  const toggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <InfoBox title="Languages" isEditable={isEditable} onEdit={toggleEdit}>
      {!editMode ? (
        <>
          {data.length > 0 ? (
            data.map((lang) => (
              <p key={lang.language.id} className="row-space-between">
                <span>{lang.language.name}</span>
                <span>{toClientLangLevel(lang.level)}</span>
              </p>
            ))
          ) : (
            <p>No languages there yet</p>
          )}
        </>
      ) : (
        <LanguagesForm
          data={data}
          updateLanguages={updateLanguages}
          isPending={isPending}
          goBack={toggleEdit}
        />
      )}
      <RequestError error={updateLangError?.message} />
    </InfoBox>
  );
}
