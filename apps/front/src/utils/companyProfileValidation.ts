import { MainInfoData } from '@/types/companyProfile';

export function removeEmpty(values: MainInfoData): MainInfoData {
  const updated: MainInfoData = { ...values };

  for (const key in updated) {
    if (updated[key as keyof MainInfoData] === '') {
      updated[key as keyof MainInfoData] = null;
    }
  }

  return updated;
}

export function replaceNulls(values: MainInfoData): MainInfoData {
  const updated: MainInfoData = { ...values };

  for (const key in updated) {
    if (updated[key as keyof MainInfoData] === null) {
      updated[key as keyof MainInfoData] = '';
    }
  }

  return updated;
}

export function validateCompanyInfoData(values: MainInfoData) {
  const errors: Partial<MainInfoData> = {};

  if (values.name && !values.name.trim()) {
    errors.name = 'Company name is required.';
  }

  if (values.url && values.url.trim()) {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/i;
    if (!urlPattern.test(values.url)) {
      errors.url = 'Invalid URL format.';
    }
  }

  return errors;
}
