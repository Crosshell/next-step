import api from './axios';
import { handleError } from '@/utils/errorUtils';
import { ApiResponse } from '@/types/authForm';

export async function registerUser(data: {
  email: string;
  password: string;
  type: string;
}): Promise<ApiResponse> {
  try {
    await api.post('/auth/register', data);
    return { status: 'ok', error: null };
  } catch (error: unknown) {
    return handleError(error, 'Registration failed');
  }
}

export async function checkUserConfirmed(token: string | null) {
  try {
    const response = await api.get(`/auth/verify`, {
      params: { token },
    });
    return !!response.data.confirmed;
  } catch {
    throw new Error('Failed to check confirmation status');
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    await api.post('/auth/login', data);
    return { status: 'ok', error: null };
  } catch (error: unknown) {
    return handleError(error, 'Sign In failed');
  }
}

export async function forgetPass(data: {
  email: string;
}): Promise<ApiResponse> {
  try {
    await api.post('/auth/forgot-password', data);
    return { status: 'ok', error: null };
  } catch (error: unknown) {
    return handleError(error, 'Failed to send reset email');
  }
}

export async function resetPass(data: {
  token: string | null;
  password: string | undefined;
}) {
  try {
    const response = await api.post(
      '/auth/reset-password',
      { password: data.password },
      {
        params: { token: data.token },
      }
    );
    return !!response.data.confirmed;
  } catch {
    throw new Error('Failed to reset password');
  }
}

export async function resendEmail(data: { email: string }) {
  try {
    const response = await api.post('/auth/verify/resend', data);
    return !!response.data.confirmed;
  } catch {
    throw new Error('Failed to resend confirmation email');
  }
}

export async function logoutUser() {
  return api
    .post('/auth/logout')
    .then(() => ({ status: 'ok', error: null, statusCode: 200 }))
    .catch((error) => {
      const statusCode = error?.response?.status || 500;
      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        'Logout failed';
      return { status: 'error', error: message, statusCode };
    });
}

export async function logoutAll() {
  try {
    const response = await api.post('/auth/logout-all');
    return response.data;
  } catch {
    throw new Error('Logout failed');
  }
}
