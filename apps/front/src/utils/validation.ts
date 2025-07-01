import {
  PartialRegistrationFormData,
  ProfileFormData,
  LogInFormData,
} from '@/types/authForm';

export const validateEmail = (email?: string): string | null => {
  if (!email || email.length < 6 || !email.includes('@')) {
    return 'Invalid email address';
  }
  return null;
};

export const validatePassword = (password?: string): string | null => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

export const checkPasswords = (
  password?: string,
  confirm?: string
): string[] => {
  const errors: string[] = [];

  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);

  if (password !== confirm) {
    errors.push('Passwords do not match');
  }

  return errors;
};

export const validateRegistrationForm = (
  data: PartialRegistrationFormData
): string[] => {
  const errors: string[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  errors.push(...checkPasswords(data.password, data.confirm));

  return errors;
};

export const validateLogInForm = (data: LogInFormData): string[] => {
  const errors: string[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  return errors;
};

export const validateProfileForm = (data: ProfileFormData): string[] => {
  const errors: string[] = [];

  if (!data['first-name']) {
    errors.push('Fill the First Name field, please');
  }

  if (!data['last-name']) {
    errors.push('Fill the Last Name field, please');
  }

  return errors;
};
