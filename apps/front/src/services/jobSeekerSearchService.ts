import { CompaniesSearchForm } from '@/types/companiesSearch';
import api from './axios';

export async function searchJobSeekers(data: CompaniesSearchForm) {
  return api
    .post('/job-seekers/search', data)
    .then((response) => {
      return {
        status: 'ok',
        error: null,
        data: response.data,
      };
    })
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Creating vacancy failed';
      return { status: 'error', error: message, data: null };
    });
}
