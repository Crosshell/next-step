import api from './axios';
import { isAxiosError } from 'axios';

import { handleError } from '@/utils/errorUtils';

import { ApiResponse } from '@/types/authForm';
import { ProfileFormData } from '@/types/profile';

export async function createProfile(
  data: ProfileFormData
): Promise<ApiResponse> {
  try {
    console.log('starting...');
    await api.post('/job-seekers', data);
    return { status: 'ok', error: null };
  } catch (error: unknown) {
    return handleError(error, 'Creating Profile failed');
  }
}

interface ErrorResponse {
  message: string;
}

export async function getProfile() {
  try {
    const response = await api.get('/job-seekers/me');
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<ErrorResponse>(error)) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || 'Failed to fetch profile',
      };
    }

    throw { status: 500, message: 'Unexpected error' };
  }
}
