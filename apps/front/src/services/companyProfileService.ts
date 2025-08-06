import api from './axios';

export async function getMyCompanyProfile() {
  return api
    .get('/companies/me')
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
