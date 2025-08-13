import { VacancyFormValues } from '@/types/vacancy';
import api from './axios';

export async function getMyVacancies() {
  return api
    .get('/vacancies/my')
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

export async function createVacancy(data: VacancyFormValues) {
  return api
    .post('/vacancies', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Creating profile failed';
      return { status: 'error', error: message };
    });
}

export async function getVacancyById(id: string) {
  return api
    .get(`/vacancies/${id}`)
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
