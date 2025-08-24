import { CompaniesSearchForm } from '@/types/companiesSearch';

export function searchCompaniesFormValidate(values: CompaniesSearchForm) {
  const errors: Record<string, string> = {};
  if (values.name && values.name.length < 10) {
    errors.name = 'Name must be at least 10 characters';
  }

  console.log('validate', values, errors);
  return errors;
}

export function submitCompaniesSearchForm(
  values: CompaniesSearchForm,
  onSubmit: (values: CompaniesSearchForm) => void
) {
  onSubmit(values);
}

export function mapQueryToCompaniesForm(query: {
  [k: string]: string;
}): CompaniesSearchForm {
  const result: Partial<CompaniesSearchForm> = {};

  if (query.name) result.name = query.name;
  if (query.page) result.page = Number(query.page);

  return result as CompaniesSearchForm;
}
