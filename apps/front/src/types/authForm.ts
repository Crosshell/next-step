interface RegistrationFormData {
  role: string;
  email: string;
  password: string;
  confirm: string;
}

type PartialRegistrationFormData = Partial<RegistrationFormData>;

interface ValidationError {
  field: string;
  message: string;
}

export {
  type RegistrationFormData,
  type PartialRegistrationFormData,
  type ValidationError,
};
