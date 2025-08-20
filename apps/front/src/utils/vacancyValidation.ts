import { VacancyData } from '@/types/vacancies';
import { VacancyFormValues } from '@/types/vacancy';

export function validateVacancyForm(values: VacancyFormValues) {
  const errors: Partial<Record<keyof VacancyFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length < 10) {
    errors.title = 'Title must be at least 10 characters long';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  } else if (values.description.trim().length < 50) {
    errors.description = 'Description must be at least 50 characters long';
  }

  if (Number(values.salaryMin) <= 0) {
    errors.salaryMin = 'Salary must be positive';
  }

  if (Number(values.salaryMax) <= 0) {
    errors.salaryMax = 'Salary must be positive';
  }

  if (
    values.salaryMin &&
    values.salaryMax &&
    Number(values.salaryMin) >= Number(values.salaryMax)
  ) {
    errors.salaryMax = 'Max salary should be greater than min salary';
  }

  if (!values.officeLocation.trim()) {
    errors.officeLocation = 'Office location is required';
  }

  if (!values.workFormat.length) {
    errors.workFormat = 'Select at least one work format';
  }

  if (!values.employmentType.length) {
    errors.employmentType = 'Select at least one employment type';
  }

  if (Number(values.experienceRequired) <= 0) {
    errors.experienceRequired = 'Experience must be positive';
  }
  if (Number(values.experienceRequired) > 50) {
    errors.experienceRequired = 'Experience must not be greater than 50';
  }

  if (!values.seniorityLevel.trim()) {
    errors.seniorityLevel = 'Select a seniority level';
  }

  return errors;
}

export function mapVacancyToFormValues(data: VacancyData): VacancyFormValues {
  return {
    id: data.id,
    isActive: data.isActive,
    title: data.title,
    description: data.description,
    salaryMin: data.salaryMin.toString(),
    salaryMax: data.salaryMax.toString(),
    officeLocation: data.officeLocation,
    experienceRequired: data.experienceRequired.toString(),
    workFormat: data.workFormat,
    employmentType: data.employmentType,
    seniorityLevel: data.seniorityLevel,
    languages: data.requiredLanguages.map((l) => ({
      languageId: l.language.id,
      level: l.level,
      language: { id: l.language.id, name: l.language.name },
    })),
    skills: data.requiredSkills.map((s) => ({
      skill: {
        id: s.skill.id,
        name: s.skill.name,
      },
    })),
    newSkill: '',
  };
}
