import {
  PartialRegistrationFormData,
  ProfileFormData,
  ValidationError,
} from '@/types/authForm';

export const validateRegistrationForm = (data: PartialRegistrationFormData) => {
  const errors: ValidationError[] = [];

  if (!data.email || data.email.length < 6 || !data.email.includes('@')) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }

  if (data.password !== data.confirm) {
    errors.push({ field: 'confirm', message: 'Passwords do not match' });
  }

  return errors;
};

export const validateProfileForm = (data: ProfileFormData) => {
  const errors: ValidationError[] = [];

  if (!data['first-name']) {
    errors.push({
      field: 'first-name',
      message: 'Fill the First Name field, please',
    });
  }

  if (!data['last-name']) {
    errors.push({
      field: 'last-name',
      message: 'Fill the Last Name field, please',
    });
  }

  return errors;
};
