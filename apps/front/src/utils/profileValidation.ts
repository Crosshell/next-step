import { FormikHelpers } from 'formik';

import {
  CertificateData,
  EducationData,
  ExperienceData,
  LanguageData,
  UpdatedPersonalData,
} from '@/types/profile';
import { ProfileFormData } from '@/types/profile';

export function validateProfileForm(values: UpdatedPersonalData) {
  const errors: Partial<ProfileFormData> = {};

  if (values.firstName) {
    if (!values.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s'-]{2,30}$/.test(values.firstName)) {
      errors.firstName =
        'First name must contain only letters and be 2–30 characters';
    }
  }
  if (values.lastName) {
    if (!values.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s'-]{2,30}$/.test(values.lastName)) {
      errors.lastName =
        'Last name must contain only letters and be 2–30 characters';
    }
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const birthDate = new Date(values.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (birthDate > today) {
      errors.dateOfBirth = 'Birth date cannot be in the future';
    } else if (age < 16) {
      errors.dateOfBirth = 'You must be at least 16 years old';
    }
  }

  return errors;
}

export function handleCertificatesSubmit(
  values: { certs: CertificateData[] },
  helpers: FormikHelpers<{ certs: CertificateData[] }>,
  onSuccess: (updatedCerts: CertificateData[]) => void
) {
  const { setErrors } = helpers;

  const hasEmpty = values.certs.some(
    (cert) => !cert.name || !cert.url || !cert.date
  );

  if (hasEmpty) {
    setErrors({ certs: 'All certificate fields must be filled' });
    return;
  }

  const nameSet = new Set<string>();
  const urlSet = new Set<string>();
  let hasDuplicateName = false;
  let hasDuplicateUrl = false;

  for (const cert of values.certs) {
    if (nameSet.has(cert.name)) {
      hasDuplicateName = true;
    } else {
      nameSet.add(cert.name);
    }

    if (urlSet.has(cert.url)) {
      hasDuplicateUrl = true;
    } else {
      urlSet.add(cert.url);
    }
  }

  const errorParts: string[] = [];
  if (hasDuplicateName) errorParts.push('names');
  if (hasDuplicateUrl) errorParts.push('URLs');

  if (errorParts.length > 0) {
    setErrors({
      certs: `Certificate ${errorParts.join(' and ')} must be unique`,
    });
    return;
  }

  onSuccess(values.certs);
}

export function handleLanguagesSubmit(
  values: { languages: LanguageData[] },
  helpers: FormikHelpers<{ languages: LanguageData[] }>,
  onSuccess: (updatedLanguages: LanguageData[]) => void
) {
  const seen = new Set();
  const duplicates = values.languages.some((lang) => {
    if (seen.has(lang.language)) return true;
    seen.add(lang.language);
    return false;
  });

  const hasEmptyFields = values.languages.some(
    (lang) => !lang.language || !lang.level
  );

  if (duplicates) {
    helpers.setErrors({ languages: 'Languages must be unique' });
    return;
  }

  if (hasEmptyFields) {
    helpers.setErrors({ languages: 'All language fields must be filled' });
    return;
  }

  onSuccess(values.languages);
}

export function handleExperienceSubmit(
  values: { experience: ExperienceData[] },
  helpers: FormikHelpers<{ experience: ExperienceData[] }>,
  onSuccess: (updatedExperience: ExperienceData[]) => void
) {
  const { setErrors } = helpers;

  const hasEmptyFields = values.experience.some(
    (exp) =>
      !exp.companyName.trim() || !exp.startDate.trim() || !exp.details.trim()
  );

  if (hasEmptyFields) {
    setErrors({
      experience: 'All fields must be filled.',
    });
    return;
  }

  const missingEndDate = values.experience.some(
    (exp) => !exp.isCurrent && !exp.endDate?.trim()
  );

  if (missingEndDate) {
    setErrors({
      experience: 'End Date is required if the job is not current.',
    });
    return;
  }

  const invalidDateRange = values.experience.some((exp) => {
    if (exp.isCurrent || !exp.endDate) return false;

    const start = new Date(exp.startDate);
    const end = new Date(exp.endDate);

    return start > end;
  });

  if (invalidDateRange) {
    setErrors({
      experience: 'Start Date must be earlier than End Date.',
    });
    return;
  }

  onSuccess(values.experience);
}

export function handleEducationSubmit(
  values: { education: EducationData[] },
  helpers: FormikHelpers<{ education: EducationData[] }>,
  onSuccess: (updatedEducation: EducationData[]) => void
) {
  const { setErrors } = helpers;

  const hasEmptyFields = values.education.some(
    (edu) =>
      !edu.universityName.trim() ||
      !edu.degree.trim() ||
      !edu.field.trim() ||
      !edu.startDate.trim() ||
      !edu.details.trim()
  );

  if (hasEmptyFields) {
    setErrors({
      education: 'All required fields must be filled.',
    });
    return;
  }

  const invalidDateRange = values.education.some((edu) => {
    if (!edu.endDate?.trim()) return false;

    const start = new Date(edu.startDate);
    const end = new Date(edu.endDate);

    return start > end;
  });

  if (invalidDateRange) {
    setErrors({
      education: 'Start Date must be earlier than End Date.',
    });
    return;
  }

  onSuccess(values.education);
}
