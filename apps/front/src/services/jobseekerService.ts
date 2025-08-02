import api from './axios';
import {
  ProfileFormData,
  UpdatedPersonalData,
  UpdatedSkills,
} from '@/types/profile';

export async function createProfile(data: ProfileFormData) {
  return api
    .post('/job-seekers', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Creating profile failed';
      return { status: 'error', error: message };
    });
}

export async function getProfile() {
  return api
    .get('/job-seekers/me')
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

export async function updatePersonalData(data: UpdatedPersonalData) {
  return api
    .patch('/job-seekers/me', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Updating personal data failed';
      return { status: 'error', error: message };
    });
}

export async function updateSkills(data: UpdatedSkills) {
  return api
    .put('/job-seekers/me/skills', data)
    .then(() => ({ status: 'ok', error: null }))
    .catch((error) => {
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Updating personal data failed';
      return { status: 'error', error: message };
    });
}
