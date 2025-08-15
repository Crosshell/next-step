import { useQuery } from '@tanstack/react-query';
import classes from './VacancyForm.module.css';
import { useVacancyStore } from '@/store/useVacancyStore';
import { LanguageData } from '@/types/profile';
import { ApiError } from '@/types/authForm';
import { getLanguages } from '@/services/jobseekerService';
import LanguageRow from '@/components/FormItems/LanguageRow';

export default function Languages() {
  const { data: languagesList = [], error: fetchLangError } = useQuery<
    LanguageData[] | null,
    ApiError
  >({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
    <div className={classes['lang-form']}>
      <p>Languages</p>
      {/* <LanguageRow /> */}
    </div>
  );
}
