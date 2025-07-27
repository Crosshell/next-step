import { CertificateData, LanguageData } from '@/types/profile';
import { FormikHelpers } from 'formik';

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
