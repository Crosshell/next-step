interface RegistrationFormData {
  role: string;
  email: string;
  password: string;
  confirm: string;
}

type PartialRegistrationFormData = Partial<RegistrationFormData>;

interface ProfileFormData {
  'first-name': string;
  'last-name': string;
  'birth-date': string;
  field: string;
  level: string;
  university: string;
  specialty: string;
}

interface LogInFormData {
  email: string;
  password: string;
}

interface ValidationError {
  message: string;
}

export {
  type RegistrationFormData,
  type PartialRegistrationFormData,
  type LogInFormData,
  type ProfileFormData,
  type ValidationError,
};
