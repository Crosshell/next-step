import { JobSeekerSearchForm } from '@/types/jobSeekerSearch';
import { VacancySearchForm } from '@/types/vacancies';

export function mapQueryToJobSeekerForm(query: {
  [k: string]: string;
}): JobSeekerSearchForm {
  const result: Partial<JobSeekerSearchForm> = {};

  if (query.languages) {
    result.languages = JSON.parse(
      query.languages
    ) as JobSeekerSearchForm['languages'];
  }

  if (query.orderBy) {
    result.orderBy = JSON.parse(
      query.orderBy
    ) as JobSeekerSearchForm['orderBy'];
  }
  if (query.page) result.page = Number(query.page);

  if (query.skillIds) {
    result.skillIds = query.skillIds.split(',');
  }

  return result as JobSeekerSearchForm;
}

export function validateLanguages(values: JobSeekerSearchForm) {
  const errors: Record<string, any> = {};

  const invalid = values.languages.some(
    (l: any) => !l.language?.id || !l.level
  );
  if (invalid) errors.languages = 'Please select a language';

  return errors;
}

export function submitJobSeekersSearchForm(
  values: JobSeekerSearchForm,
  onSubmit: (values: any) => void
) {
  console.log(values);
  const cleaned = Object.fromEntries(
    Object.entries(values).filter(([key, value]) => {
      if (key === 'newSkill') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value !== 0;
      if (typeof value === 'object')
        return value && Object.keys(value).length > 0;

      return value !== undefined && value !== null;
    })
  );

  if (Array.isArray(cleaned.languages)) {
    cleaned.languages = cleaned.languages.map((lang) => ({
      languageId: (lang as any).language?.id ?? (lang as any).languageId,
      level: (lang as any).level,
    }));
  }

  if (Array.isArray(cleaned.skillIds)) {
    cleaned.skillIds = cleaned.skillIds.map((s: any) => String(s.skill.id));
  }

  onSubmit(cleaned);
}
