import { ApiResponse } from '@/types/authForm';

function isAxiosErrorWithData(error: unknown): error is {
  response: {
    data: {
      errors?: string[];
      message?: string;
    };
  };
} {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return false;
  }

  const response = (error as { response: unknown }).response;

  if (
    typeof response !== 'object' ||
    response === null ||
    !('data' in response)
  ) {
    return false;
  }

  const data = (response as { data: unknown }).data;

  return typeof data === 'object' && data !== null;
}

export const handleError = (
  error: unknown,
  fallbackMsg: string
): ApiResponse => {
  let message = fallbackMsg;

  if (isAxiosErrorWithData(error)) {
    const data = error.response.data;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      message = data.errors[0];
    } else if (typeof data.message === 'string') {
      message = data.message;
    }
  }

  return { status: 'error', error: message };
};
