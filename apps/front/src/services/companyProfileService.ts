import { MainInfoData, UpdCompanyProfileData } from '@/types/companyProfile';
import api from './axios';

export async function getMyCompanyProfile() {
  return api
    .get('/companies/me')
    .then((res) => res.data)
    .catch((error) => {
      const message =
        error?.response?.data?.message || 'Failed to fetch company profile';
      throw {
        status: error?.response?.status || 500,
        message,
      };
    });
}

export async function updateCompanyProfile(data: UpdCompanyProfileData) {
  return api
    .patch('/companies/me', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Updating company profile data failed';
      return { status: 'error', error: message };
    });
}

export async function createCompanyProfile(data: MainInfoData) {
  return api
    .post('/companies', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Creating company profile failed';
      return { status: 'error', error: message };
    });
}

export async function getCompanyProfileById(id: string) {
  return api
    .get(`/companies/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      const message =
        error?.response?.data?.message || 'Failed to fetch company profile';
      throw {
        status: error?.response?.status || 500,
        message,
      };
    });
}
