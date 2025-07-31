interface RegistrationFormData {
  role: string;
  email: string;
  password: string;
  confirm: string;
}

type PartialRegistrationFormData = Partial<RegistrationFormData>;

interface ProfileFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface LogInFormData {
  email: string;
  password: string;
}

interface ValidationError {
  message: string;
}

type ApiResponse =
  | { status: 'ok'; error: null }
  | { status: 'error'; error: string };

export {
  type RegistrationFormData,
  type PartialRegistrationFormData,
  type LogInFormData,
  type ProfileFormData,
  type ValidationError,
  type ApiResponse,
};
