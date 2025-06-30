import {
  PartialRegistrationFormData,
  ProfileFormData,
  LogInFormData,
} from '@/types/authForm';

export const validateRegistrationForm = (data: PartialRegistrationFormData) => {
  const errors: string[] = [];

  if (!data.email || data.email.length < 6 || !data.email.includes('@')) {
    errors.push('Invalid email address');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (data.password !== data.confirm) {
    errors.push('Passwords do not match');
  }

  return errors;
};

export const validateProfileForm = (data: ProfileFormData) => {
  const errors: string[] = [];

  if (!data['first-name']) {
    errors.push('Fill the First Name field, please');
  }

  if (!data['last-name']) {
    errors.push('Fill the Last Name field, please');
  }

  return errors;
};

export const validateLogInForm = (data: LogInFormData) => {
  const errors: string[] = [];

  if (!data.email || data.email.length < 6 || !data.email.includes('@')) {
    errors.push('Invalid email address');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

export const validateEmail = (email: string | undefined) => {
  let isValid = true;

  if (!email || email.length < 6 || !email.includes('@')) {
    isValid = false;
  }

  return isValid;
};

export const checkPasswords = (
  password: string | undefined,
  confirm: string | undefined
) => {
  const errors: string[] = [];

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (password !== confirm) {
    errors.push('Passwords do not match');
  }

  return errors;
};
