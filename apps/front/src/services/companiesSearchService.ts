import { CompaniesSearchForm } from '@/types/companiesSearch';
import api from './axios';

export async function searchCompanies(data: CompaniesSearchForm) {
  return api
    .post('/companies/search', data)
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

export async function getCompanyVacancies(companyId: string) {
  return api
    .get(`/vacancies/company/${companyId}`)
    .then((res) => res.data)
    .catch((error) => {
      const message =
        error?.response?.data?.message || 'Failed to fetch profile';
      throw {
        status: error?.response?.status || 500,
        message,
      };
    });
}
