import LanguagesForm from '@/components/FormItems/LanguagesForm';
import MainInfoForm from './MainInfoForm';
import { updateVacancyLanguages } from '@/services/vacanciesService';
import { useMutation } from '@tanstack/react-query';

import classes from './VacancyForm.module.css';

export default function VacancyForm() {
  const { mutate: updateVacLanguages, isPending } = useMutation({
    mutationFn: updateVacancyLanguages,
    onSuccess: (result) => {
      if (result.status === 'error') return;
    },
  });

  const vacancyId = 'ffsfsf-sdf-2f2-f';

  return (
    <div className={classes['vacancy-form']}>
      <MainInfoForm />
      <LanguagesForm
        updateLanguages={(data) => updateVacLanguages({ id: vacancyId, data })}
        isPending={isPending}
      />
    </div>
  );
}
