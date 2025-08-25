import { JobSeekerSearchForm } from '@/types/jobSeekerSearch';

export function mapQueryToJobSeekerForm(query: {
  [k: string]: string;
}): JobSeekerSearchForm {
  const result: Partial<JobSeekerSearchForm> = {};

  // if (query.seniorityLevels) {
  //   result.seniorityLevel =
  //     query.seniorityLevel as JobSeekerSearchForm['seniorityLevel'];
  // }

  if (query.requiredLanguages) {
    result.languages = JSON.parse(
      query.requiredLanguages
    ) as JobSeekerSearchForm['languages'];
  }

  if (query.orderBy) {
    result.orderBy = JSON.parse(
      query.orderBy
    ) as JobSeekerSearchForm['orderBy'];
  }
  if (query.page) result.page = Number(query.page);

  if (query.skillIds) {
    result.skillIds = query.requiredSkillIds.split(',');
  }

  return result as JobSeekerSearchForm;
}
