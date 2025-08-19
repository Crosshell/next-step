import { VacancyFormValues } from '@/types/vacancy';
import api from './axios';
import { UpdatedUserLanguages } from '@/types/profile';

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
    .then((response) => {
      console.log(response.data.id);
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

export async function deleteVacancy(id: string | undefined) {
  return api
    .delete(`/vacancies/${id}`)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Creating profile failed';
      return { status: 'error', error: message };
    });
}

export async function updateVacancyLanguages({
  id,
  data,
}: {
  id: string;
  data: UpdatedUserLanguages[];
}) {
  return api
    .put(`/vacancies/${id}/languages`, { requiredLanguages: data })
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Updating languages failed';
      return { status: 'error', error: message };
    });
}

export async function updateVacancySkills({
  id,
  data,
}: {
  id: string;
  data: string[];
}) {
  return api
    .put(`/vacancies/${id}/skills`, { requiredSkillIds: data })
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Updating languages failed';
      return { status: 'error', error: message };
    });
}
