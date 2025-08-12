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
