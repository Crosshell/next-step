interface RegistrationFormData {
  role: string;
  email: string;
  password: string;
  confirm: string;
}

type PartialRegistrationFormData = Partial<RegistrationFormData>;

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

interface ApiError {
  status: number;
  message: string;
}

export {
  type RegistrationFormData,
  type PartialRegistrationFormData,
  type LogInFormData,
  type ValidationError,
  type ApiResponse,
  type ApiError,
};
